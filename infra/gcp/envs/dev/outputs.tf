# -----------------------------------------------------------------------------
# Project Information
# -----------------------------------------------------------------------------

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP region for resources"
  value       = var.region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

# -----------------------------------------------------------------------------
# Artifact Registry Outputs
# -----------------------------------------------------------------------------

output "artifact_registry_repository_id" {
  description = "Artifact Registry repository ID"
  value       = module.artifact_registry.repository_id
}

output "artifact_registry_repository_url" {
  description = "Artifact Registry repository URL for docker commands"
  value       = module.artifact_registry.repository_url
}

output "artifact_registry_docker_hostname" {
  description = "Docker registry hostname"
  value       = module.artifact_registry.docker_hostname
}

output "artifact_registry_full_path" {
  description = "Full path for docker images"
  value       = module.artifact_registry.repository_full_path
}

# -----------------------------------------------------------------------------
# Secret Manager Outputs
# -----------------------------------------------------------------------------

output "secret_ids" {
  description = "Map of secret names to their resource IDs"
  value       = module.secret_manager.secret_ids
}

output "secret_names" {
  description = "Map of secret names to their secret_id values"
  value       = module.secret_manager.secret_names
}

output "secrets_created" {
  description = "List of secret names created"
  value       = keys(module.secret_manager.secret_ids)
}

# -----------------------------------------------------------------------------
# Service Account Outputs
# -----------------------------------------------------------------------------

output "service_accounts" {
  description = "Map of Cloud Run service names to their service account details"
  value       = module.iam.service_accounts
}

output "service_account_emails" {
  description = "Map of service names to their service account email addresses"
  value       = module.iam.service_account_emails
}

output "iam_summary" {
  description = "Summary of IAM configuration for each service"
  value       = module.iam.iam_summary
}

# -----------------------------------------------------------------------------
# Cloud Run Service Outputs
# -----------------------------------------------------------------------------

output "cloud_run_services" {
  description = "Map of Cloud Run service names to their details"
  value = {
    for service_name, service in module.cloud_run_services :
    service_name => service.service_summary
  }
}

output "cloud_run_service_urls" {
  description = "Map of Cloud Run service names to their public URLs"
  value = {
    for service_name, service in module.cloud_run_services :
    service_name => service.service_url
  }
}

output "cloud_run_service_names" {
  description = "List of Cloud Run service names"
  value       = [for service_name in keys(module.cloud_run_services) : service_name]
}


output "lab_service_url" {
  description = "Lab service URL"
  value       = try(module.cloud_run_services["lab-service"].service_url, "")
}

# -----------------------------------------------------------------------------
# Docker Build Commands
# -----------------------------------------------------------------------------

output "docker_build_commands" {
  description = "Example docker build and push commands for each service"
  value = {
    for service_name, service_config in var.services :
    service_name => {
      tag       = "${module.artifact_registry.repository_full_path}/${service_config.image_name}:${service_config.image_tag}"
      build_cmd = "docker build -t ${module.artifact_registry.repository_full_path}/${service_config.image_name}:${service_config.image_tag} ./backend/${service_name}"
      push_cmd  = "docker push ${module.artifact_registry.repository_full_path}/${service_config.image_name}:${service_config.image_tag}"
    }
  }
}

# -----------------------------------------------------------------------------
# VPC Connector Outputs
# -----------------------------------------------------------------------------

output "vpc_connector_enabled" {
  description = "Whether VPC connector is enabled"
  value       = var.enable_vpc_connector
}

output "vpc_connector_name" {
  description = "Name of the VPC connector"
  value       = var.enable_vpc_connector ? module.networking[0].connector_name : null
}

output "vpc_connector_self_link" {
  description = "Self-link of the VPC connector (for Cloud Run)"
  value       = var.enable_vpc_connector ? module.networking[0].connector_self_link : null
}

# -----------------------------------------------------------------------------
# Next Steps
# -----------------------------------------------------------------------------

output "next_steps" {
  description = "Next steps for deployment"
  value       = <<-EOT

  ====================================================================
  Terraform Apply Successful - Next Steps:
  ====================================================================

  1. Authenticate Docker with Artifact Registry:
     gcloud auth configure-docker ${module.artifact_registry.docker_hostname}

  2. Set secret values (or run scripts/gcloud/set-secrets.sh <project-id> from a populated .env):

     # PostgreSQL credentials
     echo -n "YOUR_DB_USER" | gcloud secrets versions add postgres-user --data-file=-
     echo -n "YOUR_DB_PASSWORD" | gcloud secrets versions add postgres-password --data-file=-
     echo -n "lab_service" | gcloud secrets versions add postgres-database --data-file=-

     # JWT signing key
     echo -n "$(openssl rand -base64 32)" | gcloud secrets versions add jwt-signing-key --data-file=-

     # Redis credentials (set these from your external Redis provider)
     echo -n "YOUR_REDIS_HOST" | gcloud secrets versions add redis-host --data-file=-
     echo -n "YOUR_REDIS_PORT" | gcloud secrets versions add redis-port --data-file=-
     echo -n "YOUR_REDIS_PASSWORD" | gcloud secrets versions add redis-password --data-file=-

  3. Build and push container images:
     cd backend/lab-service
     docker build -t ${module.artifact_registry.repository_full_path}/lab-service:latest .
     docker push ${module.artifact_registry.repository_full_path}/lab-service:latest

     # Or use the Makefile from the project root:
     # make docker-push-lab-service

  4. Deploy Cloud Run services:
     terraform apply

  5. Verify deployment:
     gcloud run services list --project=${var.project_id} --region=${var.region}

  6. Access your services:
     ${join("\n     ", [for name, url in module.cloud_run_services : "${name}: ${url.service_url}"])}

  ====================================================================
  EOT
}
