# Dev Environment

This directory contains Terraform configuration for the portfolio-lab development environment on Google Cloud Platform.

## Quick Start

### Prerequisites

1. **GCP Project**: `catuns-spring-boot` (see `terraform.tfvars`)
2. **Terraform**: v1.0+ ([Install](https://developer.hashicorp.com/terraform/downloads), or run `scripts/terraform/install/linux.sh` on Linux)
3. **gcloud CLI**: Authenticated and configured ([Install](https://cloud.google.com/sdk/docs/install))
4. **Environment File**: `.env` file in project root with secrets

### Initial Setup

```bash
# 1. Authenticate with GCP
gcloud auth login
gcloud config set project catuns-spring-boot

# 2. Configure application default credentials (for Terraform)
gcloud auth application-default login

# 3. Create and configure your .env file
cd ../../..  # Go to project root
cp .env.example .env
# Edit .env with your actual credentials

# 4. Return to dev environment directory
cd infra/gcp/envs/dev

# 5. Initialize Terraform
terraform init

# 6. Review the plan
terraform plan -out=tfplan

# 7. Apply the configuration
terraform apply tfplan
```

### What Gets Deployed

The Terraform configuration creates:

1. **Artifact Registry**: Container image repository (`us-central1-docker.pkg.dev/catuns-spring-boot/portfolio`)
2. **Secret Manager**: All application secrets (database, cache, JWT, GitHub OAuth)
3. **IAM Service Accounts**: One per microservice with appropriate permissions
4. **Cloud Run Services**: Deployed microservices (currently: lab-service)
5. **VPC Connector** *(optional, disabled by default)*: For private VPC resource access

### Secrets Configuration

After deploying infrastructure with Terraform, secrets must be populated manually. For detailed information about secrets setup, see:

**[SECRETS.md](./SECRETS.md)** - Complete guide to secrets configuration

To populate or update secrets:
```bash
# From project root
scripts/gcloud/set-secrets.sh catuns-spring-boot
```

## Configuration Files

| File | Purpose |
|------|---------|
| `main.tf` | Main infrastructure configuration |
| `variables.tf` | Input variable definitions |
| `terraform.tfvars` | Variable values for dev environment |
| `outputs.tf` | Output values (URLs, service accounts, etc.) |
| `providers.tf` | GCP provider configuration |
| `versions.tf` | Terraform and provider version constraints |
| `backend.tf` | Remote state configuration (GCS bucket) |
| `SECRETS.md` | Complete guide to secrets configuration |

## Managing Services

### Enable/Disable Services

Edit `terraform.tfvars` to add or remove services:

```hcl
services = {
  lab-service = {
    image_name    = "lab-service"
    image_tag     = "latest"
    # ... configuration
  }
}
```

### Update Service Configuration

1. Modify service settings in `terraform.tfvars`
2. Plan and apply changes:
   ```bash
   terraform plan -out=tfplan
   terraform apply tfplan
   ```

## Common Operations

### View Deployed Resources

```bash
# List all resources
terraform state list

# Show Cloud Run service URLs
terraform output cloud_run_service_urls

# Show service account emails
terraform output service_account_emails
```

### Update Secrets

```bash
# Update values in .env file
vim .env

# Re-run secrets script (from project root)
scripts/gcloud/set-secrets.sh catuns-spring-boot
```

### Destroy Environment

**Warning**: This will delete all resources in the dev environment.

```bash
# Review what will be destroyed
terraform plan -destroy

# Destroy all resources
terraform destroy
```

### View Logs

```bash
# Cloud Run service logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=lab-service" \
  --project=catuns-spring-boot \
  --limit=50

# Terraform state changes
terraform show
```

## Terraform Modules

This configuration uses custom modules from `../../modules/`:

- **artifact_registry**: Container image repository
- **secret_manager**: GCP Secret Manager secrets
- **iam**: Service accounts and IAM bindings
- **cloud_run_service**: Cloud Run service deployment
- **networking**: VPC Serverless Connector (optional, disabled by default — not needed with public external services like Upstash and Neon)

## Environment Variables

The configuration expects these variables in `terraform.tfvars`:

### Required
- `project_id`: GCP project ID
- `region`: GCP region (e.g., us-central1)
- `environment`: Environment name (dev)
- `services`: Map of services to deploy
- `secrets`: List of secrets to create

### Optional
- `enable_vpc_connector`: Enable VPC connector (default: false)
- `allow_unauthenticated`: Allow public access (default: true for dev)

## Outputs

After `terraform apply`, useful outputs are displayed:

```hcl
# Cloud Run service URLs
cloud_run_service_urls = {
  lab-service = "https://lab-service-xxxxx-uc.a.run.app"
}

# Service account emails
service_account_emails = {
  lab-service = "lab-service-sa@catuns-spring-boot.iam.gserviceaccount.com"
}

# Artifact Registry repository
artifact_registry_full_path = "us-central1-docker.pkg.dev/catuns-spring-boot/portfolio"
```

## Troubleshooting

### Error: "Backend configuration changed"

```bash
terraform init -reconfigure
```

### Error: "Secret not found"

Ensure Terraform has created secrets first:
```bash
terraform apply -target=module.secret_manager
```

Then run the secrets script:
```bash
scripts/gcloud/set-secrets.sh catuns-spring-boot
```

### Error: "Permission denied"

Check your IAM permissions:
```bash
gcloud projects get-iam-policy catuns-spring-boot --flatten="bindings[].members" \
  --filter="bindings.members:user:$(gcloud config get-value account)"
```

You need these roles:
- `roles/owner` or `roles/editor` (for creating resources)
- `roles/secretmanager.admin` (for managing secrets)

### Cloud Run deployment fails

Check container image exists in Artifact Registry:
```bash
gcloud artifacts docker images list us-central1-docker.pkg.dev/catuns-spring-boot/portfolio \
  --project=catuns-spring-boot
```

## Remote State

Terraform state is stored in a GCS bucket (configured in `backend.tf`). This allows team collaboration and state locking.

**Important**: Never commit `terraform.tfstate` files to version control.

## CI/CD Integration

For automated deployments, use a service account with these roles:
- `roles/editor`
- `roles/secretmanager.admin`
- `roles/iam.serviceAccountAdmin`

Example GitHub Actions workflow:
```yaml
- name: Terraform Apply
  run: |
    cd infra/gcp/envs/dev
    terraform init
    terraform apply -auto-approve
  env:
    GOOGLE_CREDENTIALS: ${{ secrets.GCP_SA_KEY }}
```

## Additional Resources

- [Terraform GCP Provider Docs](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GCP Secret Manager](https://cloud.google.com/secret-manager/docs)
