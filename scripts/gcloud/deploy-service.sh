#!/bin/bash

# -----------------------------------------------------------------------------
# Deploy / Init Cloud Run Service
# -----------------------------------------------------------------------------
# Deploys or initializes a Cloud Run service.
#
# Default mode: forces Cloud Run to pull the latest image and create a new
# revision. Use this after pushing an updated Docker image to redeploy a
# service that Terraform won't detect as changed.
#
# Init mode (--init): creates the Cloud Run service for the first time.
# Automatically resolves the latest image from Artifact Registry using the
# service name and the GCP_REGISTRY / GCP_REPOSITORY env vars.
#
# Usage: ./deploy-service.sh <service-name> [options]
#
# Options:
#   --init                      Create the service (first-time setup)
#   --region <region>           GCP region
#   --project <id>              GCP project ID
#   --tag <tag>                 Image tag to deploy (default: latest from registry on --init, current revision on redeploy)
#   --port <port>               Container port (init only, default: 8080)
#   --allow-unauthenticated     Allow public unauthenticated access (init only)
#   --dry-run                   Show commands without executing
#
# Examples:
#   ./deploy-service.sh engagement-service
#   ./deploy-service.sh quiz-service --region us-east1
#   ./deploy-service.sh engagement-service --tag 0.0.2-SNAPSHOT
#   ./deploy-service.sh quiz-service --init
#   ./deploy-service.sh quiz-service --init --allow-unauthenticated --port 8080
# -----------------------------------------------------------------------------

set -e
set -u

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env"

# load env vars
source "$ENV_FILE"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

show_usage() {
    cat << EOF
Usage: $0 <service-name> [options]

Deploys or initializes a Cloud Run service.

Options:
  --init                      Create the service for the first time
  --region <region>           GCP region (default: ${GCP_REGION})
  --registry <id>             GCP registry ID (default: ${GCP_REGISTRY})
  --project <id>              GCP project ID (default: ${GCP_PROJECT_ID})
  --repository <id>           GCP repository ID (default: ${GCP_REPOSITORY})
  --tag <tag>                 Image tag (default: latest from registry on --init, current revision on redeploy)
  --port <port>               Container port, init only (default: 8080)
  --allow-unauthenticated     Allow public access, init only
  --dry-run                   Show commands without executing
  -h, --help                  Show this help

Examples:
  $0 lab-service
  $0 lab-service --tag 0.0.2-SNAPSHOT
  $0 lab-service --init
  $0 lab-service --init --allow-unauthenticated --port 8080
EOF
}

# -----------------------------------------------------------------------------
# Parse Arguments
# -----------------------------------------------------------------------------

SERVICE_NAME=""
REGION="${GCP_REGION}"
PROJECT_ID="${GCP_PROJECT_ID}"
REGISTRY="${GCP_REGISTRY}"
REPOSITORY="${GCP_REPOSITORY}"
IMAGE_TAG=""
DRY_RUN=false
INIT=false
PORT="8080"
ALLOW_UNAUTHENTICATED=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --init)                   INIT=true; shift ;;
        --region)                 REGION="$2"; shift 2 ;;
        --project)                PROJECT_ID="$2"; shift 2 ;;
        --tag)                    IMAGE_TAG="$2"; shift 2 ;;
        --repository)             REPOSITORY="$2"; shift 2 ;;
        --port)                   PORT="$2"; shift 2 ;;
        --allow-unauthenticated)  ALLOW_UNAUTHENTICATED=true; shift ;;
        --dry-run)                DRY_RUN=true; shift ;;
        -h|--help)                show_usage; exit 0 ;;
        -*)                       log_error "Unknown option: $1"; show_usage; exit 1 ;;
        *)
            if [ -z "$SERVICE_NAME" ]; then
                SERVICE_NAME="$1"
            else
                log_error "Unexpected argument: $1"
                exit 1
            fi
            shift
            ;;
    esac
done

if [ -z "$SERVICE_NAME" ]; then
    log_error "Service name is required"
    show_usage
    exit 1
fi

# -----------------------------------------------------------------------------
# Validate Prerequisites
# -----------------------------------------------------------------------------

if ! command -v gcloud &> /dev/null; then
    log_error "gcloud CLI not found"
    exit 1
fi

if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" &> /dev/null; then
    log_error "Not authenticated. Run: gcloud auth login"
    exit 1
fi

# -----------------------------------------------------------------------------
# Resolve Image
# -----------------------------------------------------------------------------

IMAGE_REPO="${REGISTRY}/${PROJECT_ID}/${REPOSITORY}/${SERVICE_NAME}"

if [ "$INIT" = true ]; then
    log_info "Resolving latest image from Artifact Registry..."

    LATEST_DIGEST=$(gcloud artifacts docker images list "${IMAGE_REPO}" \
        --project="$PROJECT_ID" \
        --sort-by="~UPDATE_TIME" \
        --limit=1 \
        --format="value(version)" 2>/dev/null)

    if [ -z "$LATEST_DIGEST" ]; then
        log_error "No images found in Artifact Registry for '${IMAGE_REPO}'"
        exit 1
    fi

    CURRENT_IMAGE=""
    if [ -n "$IMAGE_TAG" ]; then
        DEPLOY_IMAGE="${IMAGE_REPO}:${IMAGE_TAG}"
    else
        DEPLOY_IMAGE="${IMAGE_REPO}@${LATEST_DIGEST}"
    fi
else
    log_info "Fetching current service configuration..."

    CURRENT_IMAGE=$(gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --project="$PROJECT_ID" \
        --format="value(spec.template.spec.containers[0].image)" 2>/dev/null)

    if [ -z "$CURRENT_IMAGE" ]; then
        log_error "Service '${SERVICE_NAME}' not found in region '${REGION}'. Use --init to create it."
        exit 1
    fi

    if [ -n "$IMAGE_TAG" ]; then
        IMAGE_BASE="${CURRENT_IMAGE%:*}"
        DEPLOY_IMAGE="${IMAGE_BASE}:${IMAGE_TAG}"
    else
        DEPLOY_IMAGE="$CURRENT_IMAGE"
    fi
fi

echo ""
log_info "Service:       ${SERVICE_NAME}"
log_info "Region:        ${REGION}"
log_info "Project:       ${PROJECT_ID}"
[ -n "$CURRENT_IMAGE" ] && log_info "Current image: ${CURRENT_IMAGE}"
log_info "Deploy image:  ${DEPLOY_IMAGE}"
echo ""

# -----------------------------------------------------------------------------
# Deploy Service
# -----------------------------------------------------------------------------

if [ "$INIT" = true ]; then
    log_info "Creating service (init)..."

    AUTH_FLAG="--no-allow-unauthenticated"
    [ "$ALLOW_UNAUTHENTICATED" = true ] && AUTH_FLAG="--allow-unauthenticated"

    DEPLOY_CMD="gcloud run deploy ${SERVICE_NAME} \
        --image=${DEPLOY_IMAGE} \
        --region=${REGION} \
        --project=${PROJECT_ID} \
        --port=${PORT} \
        ${AUTH_FLAG} \
        --quiet"
else
    log_info "Redeploying service..."

    # Use gcloud run deploy to force a new revision pulling the latest image
    DEPLOY_CMD="gcloud run deploy ${SERVICE_NAME} \
        --image=${DEPLOY_IMAGE} \
        --region=${REGION} \
        --project=${PROJECT_ID} \
        --quiet"
fi

if [ "$DRY_RUN" = true ]; then
    log_warning "DRY RUN - would execute:"
    echo "  $DEPLOY_CMD"
else
    if $DEPLOY_CMD; then
        log_success "Service deployed successfully"
    else
        log_error "Deployment failed"
        exit 1
    fi
fi

# -----------------------------------------------------------------------------
# Verify Deployment
# -----------------------------------------------------------------------------

if [ "$DRY_RUN" = false ]; then
    echo ""
    log_info "Verifying deployment..."

    # Get service URL and latest revision
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --project="$PROJECT_ID" \
        --format="value(status.url)")

    LATEST_REVISION=$(gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --project="$PROJECT_ID" \
        --format="value(status.latestReadyRevisionName)")

    log_success "URL: ${SERVICE_URL}"
    log_success "Revision: ${LATEST_REVISION}"

    echo ""
    log_info "View logs: gcloud run services logs read ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID} --limit=50"
fi
