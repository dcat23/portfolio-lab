# -----------------------------------------------------------------------------
# Project and Environment
# -----------------------------------------------------------------------------

project_id  = "catuns-spring-boot"
region      = "us-central1"
environment = "dev"

labels = {
  environment = "dev"
  project     = "portfolio"
  managed_by  = "terraform"
  team        = "platform"
}

# -----------------------------------------------------------------------------
# Artifact Registry
# -----------------------------------------------------------------------------

artifact_registry_repository_id = "portfolio"
artifact_registry_location      = "" # Defaults to var.region

# -----------------------------------------------------------------------------
# Cloud Run Services
# -----------------------------------------------------------------------------

services = {
  lab-service = {
    image_name    = "lab-service"
    image_tag     = "latest"
    port          = 8080
    cpu           = "1000m"
    memory        = "1Gi"
    min_instances = 0
    max_instances = 10
    concurrency   = 80
    timeout       = 60
    ingress       = "INGRESS_TRAFFIC_ALL"
    env_vars = {
      SPRING_PROFILES_ACTIVE = "prod"
      SERVER_PORT            = "8080"
      LOGGING_LEVEL_ROOT     = "INFO"
      REDIS_SSL_ENABLED      = "true"
    }
    secret_env_vars = {
      DATABASE_USER = {
        secret_name = "postgres-user"
        version     = "latest"
      }
      DATABASE_PASSWORD = {
        secret_name = "postgres-password"
        version     = "latest"
      }
      DATABASE_NAME = {
        secret_name = "postgres-database"
        version     = "latest"
      }
      DATABASE_HOST = {
        secret_name = "postgres-host"
        version     = "latest"
      }
      JWT_SECRET = {
        secret_name = "jwt-signing-key"
        version     = "latest"
      }
      # Redis credentials (set manually via set-secrets.sh)
      REDIS_HOST = {
        secret_name = "redis-host"
        version     = "latest"
      }
      REDIS_PORT = {
        secret_name = "redis-port"
        version     = "latest"
      }
      REDIS_PASSWORD = {
        secret_name = "redis-password"
        version     = "latest"
      }
      GITHUB_OAUTH = {
        secret_name = "github-oauth-token"
        version     = "latest"
      }
    }
  }
}

allow_unauthenticated = true # Dev environment allows public access for testing

# -----------------------------------------------------------------------------
# Secret Manager
# -----------------------------------------------------------------------------

secrets = [
  {
    name        = "jwt-signing-key"
    description = "JWT signing key for session tokens"
  },
  {
    name        = "postgres-user"
    description = "PostgreSQL database username for quiz service"
  },
  {
    name        = "postgres-password"
    description = "PostgreSQL database password for quiz service"
  },
  {
    name        = "postgres-host"
    description = "PostgreSQL database host for quiz service"
  },
  {
    name        = "postgres-database"
    description = "PostgreSQL database name for quiz service"
  },
  {
    name        = "redis-host"
    description = "Redis host for caching"
  },
  {
    name        = "redis-port"
    description = "Redis port"
  },
  {
    name        = "redis-password"
    description = "Redis AUTH password for authentication"
  },
  {
    name        = "github-oauth-token"
    description = "GitHub OAuth token for API access"
  }
]

# -----------------------------------------------------------------------------
# Vertex AI
# -----------------------------------------------------------------------------

enable_vertex_ai      = false
vertex_ai_endpoint_id = "" # Leave empty if not yet deployed

# -----------------------------------------------------------------------------
# Networking
# -----------------------------------------------------------------------------

network_name               = "default"
enable_vpc_connector       = false # Not needed with public external services (Upstash, Neon)
vpc_connector_name         = "portfolio-dev-vpc"
vpc_connector_cidr         = "10.8.0.0/28"
vpc_connector_machine_type = "e2-micro"
vpc_connector_min_instances = 2
vpc_connector_max_instances = 3
vpc_egress_setting         = "PRIVATE_RANGES_ONLY"

