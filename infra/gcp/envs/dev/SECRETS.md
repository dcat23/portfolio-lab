# GCP Secret Manager Setup

This guide explains how to configure and populate secrets on Google Cloud Platform.

## Overview

GCP Secret Manager is used to securely store sensitive configuration values such as:
- Database connection details
- Cache (Redis) credentials
- JWT signing keys
- GitHub OAuth tokens

The secrets are automatically created by Terraform, but their values must be populated separately using the `set-secrets.sh` script.

## Prerequisites

1. **GCP Project**: You need a GCP project with billing enabled
   - Project ID: `catuns-spring-boot` (see `terraform.tfvars`)

2. **Authentication**: Authenticate with gcloud CLI
   ```bash
   gcloud auth login
   gcloud config set project $GCP_PROJECT_ID
   ```

3. **IAM Permissions**: Your account needs one of these roles:
   - `roles/secretmanager.admin` (recommended for setup)
   - `roles/secretmanager.secretVersionAdder` (minimum required)

4. **Required Tools**:
   - `gcloud` CLI: [Installation guide](https://cloud.google.com/sdk/docs/install)
   - `openssl`: For generating JWT signing keys

5. **Environment File**: A `.env` file in the project root with all required secrets

## Secrets Configuration

### Required Secrets

The following secrets must be populated for the platform to function:

#### Database (PostgreSQL)
| Secret Name         | Environment Variable | Description                                               |
|---------------------|----------------------|-----------------------------------------------------------|
| `postgres-host`     | `DATABASE_HOST`      | PostgreSQL host (e.g., Neon, Cloud SQL endpoint)          |
| `postgres-database` | `DATABASE_NAME`      | Database name (defaults to `lab_service` if not provided) |
| `postgres-user`     | `DATABASE_USER`      | Database username                                         |
| `postgres-password` | `DATABASE_PASSWORD`  | Database password                                         |

#### Cache (Redis / Upstash)
| Secret Name       | Environment Variable | Description                          |
|--------------------|----------------------|---------------------------------------|
| `redis-host`       | `REDIS_HOST`         | Redis host (defaults to `6379` port) |
| `redis-port`       | `REDIS_PORT`         | Redis port (defaults to `6379`)      |
| `redis-password`   | `REDIS_PASSWORD`     | Redis AUTH password                  |

#### Authentication
| Secret Name          | Environment Variable | Description                                        |
|-----------------------|----------------------|-----------------------------------------------------|
| `jwt-signing-key`     | `JWT_SIGNING_KEY`    | JWT signing key (auto-generated if not provided)    |
| `github-oauth-token`  | `GITHUB_OAUTH`       | GitHub OAuth token for API access                   |

## Setup Instructions

### Step 1: Create the Environment File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your actual credentials:
   ```bash
   # GCP Configuration
   GCP_PROJECT_ID=catuns-spring-boot
   GCP_REGION=us-central1

   # PostgreSQL Database
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_HOST=your-db-host.neon.tech
   DATABASE_NAME=lab_service

   # Redis (Upstash)
   REDIS_HOST=your-redis-host.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password

   # GitHub OAuth
   GITHUB_OAUTH=your_github_oauth_token

   # JWT Authentication
   JWT_SIGNING_KEY=  # Will be auto-generated if empty
   ```

3. **Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

### Step 2: Deploy Infrastructure with Terraform

The Terraform configuration will:
1. Create all secrets in GCP Secret Manager (empty)
2. Set up IAM permissions for service accounts to access secrets

```bash
cd infra/gcp/envs/dev

# Initialize Terraform (first time only)
terraform init

# Review the planned changes
terraform plan

# Apply the configuration
terraform apply
```

### Step 3: Populate Secret Values

After Terraform creates the secrets, populate them with values from your `.env` file:

```bash
# From the project root
scripts/gcloud/set-secrets.sh catuns-spring-boot
```

**Important:** This step must be done **after** `terraform apply` completes successfully.

**Output Example:**
```
[INFO] Starting secret provisioning for project: catuns-spring-boot
[INFO] Reading from: /path/to/portfolio-lab/.env

=== PostgreSQL Database Configuration ===
[INFO] Setting secret: postgres-user
[SUCCESS] Secret postgres-user updated
[INFO] Setting secret: postgres-password
[SUCCESS] Secret postgres-password updated
...

=======================================================================
[INFO] Secret provisioning complete!
=======================================================================

Total secrets processed: 9
[SUCCESS] Successfully set: 9

[SUCCESS] All secrets have been successfully provisioned in GCP Secret Manager
[INFO] Secrets are now available for Cloud Run services
```

## Verification

### Verify Secrets in GCP Console

1. Go to [GCP Console - Secret Manager](https://console.cloud.google.com/security/secret-manager)
2. Select your project: `catuns-spring-boot`
3. Verify all secrets are created and have at least one version

### Verify Secrets via gcloud CLI

```bash
# List all secrets
gcloud secrets list --project=catuns-spring-boot

# View a specific secret (requires permissions)
gcloud secrets versions access latest --secret=postgres-host --project=catuns-spring-boot
```

### Test Cloud Run Service Access

After deploying Cloud Run services, verify they can access secrets:

```bash
# View service logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=lab-service" \
  --project=catuns-spring-boot \
  --limit=50 \
  --format="table(timestamp, textPayload)"
```

Look for any `SecretManager` permission errors in the logs.

## Updating Secrets

### Update via Script

1. Modify values in `.env`
2. Run the script again:
   ```bash
   scripts/gcloud/set-secrets.sh catuns-spring-boot
   ```

### Update via gcloud CLI

```bash
# Update a specific secret
echo -n "new-secret-value" | gcloud secrets versions add SECRET_NAME \
  --project=catuns-spring-boot \
  --data-file=-
```

### Update via Terraform (Not Recommended)

While Terraform can manage secret values, it's **not recommended** because:
- Secret values would be stored in Terraform state (security risk)
- State files may be committed to version control
- Better to use the script or manual gcloud commands

## Troubleshooting

### Error: "Permission denied on secret"

**Cause**: Your account doesn't have permissions to create/update secrets

**Solution**:
```bash
# Grant yourself Secret Manager Admin role (requires Owner/Admin permissions)
gcloud projects add-iam-policy-binding catuns-spring-boot \
  --member="user:your-email@example.com" \
  --role="roles/secretmanager.admin"
```

### Error: "Secret not found"

**Cause**: Secrets haven't been created by Terraform yet

**Solution**:
```bash
cd infra/gcp/envs/dev
terraform apply  # This creates the secrets
```

### Error: "Environment file not found"

**Cause**: The `.env` file doesn't exist in the project root

**Solution**:
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### Cloud Run Service Can't Access Secrets

**Cause**: Service account doesn't have `secretAccessor` role

**Solution**: The IAM module in Terraform automatically grants access. Verify:
```bash
# Check IAM bindings for a secret
gcloud secrets get-iam-policy postgres-host --project=catuns-spring-boot
```

You should see service accounts with `roles/secretmanager.secretAccessor`.

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate secrets regularly** (every 90 days recommended)
3. **Use least-privilege IAM roles** for service accounts
4. **Enable audit logging** for Secret Manager access
5. **Use different secrets for each environment** (dev, staging, prod)
6. **Monitor secret access** via Cloud Logging

## Secret Rotation

To rotate a secret:

1. Update the value in `.env`
2. Run the provisioning script:
   ```bash
   scripts/gcloud/set-secrets.sh catuns-spring-boot
   ```
3. Cloud Run services will automatically use the latest version (no restart needed)

## Additional Resources

- [GCP Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Cloud Run Secrets](https://cloud.google.com/run/docs/configuring/secrets)
