#!/usr/bin/env bash
# Install Terraform on Linux via the official HashiCorp apt repository.
# Falls back to the standalone zip installer if apt is unavailable.
#
# Usage: ./linux.sh [version]
#   version   Optional Terraform version to install (e.g. 1.9.5).
#             Defaults to the latest stable release. Only used by the
#             standalone (non-apt) install path.
set -euo pipefail

if command -v terraform &>/dev/null; then
    echo "terraform is already installed: $(terraform version | head -1)"
    exit 0
fi

if command -v apt-get &>/dev/null; then
    echo "Installing Terraform via apt..."

    sudo apt-get update -y
    sudo apt-get install -y apt-transport-https ca-certificates gnupg curl software-properties-common

    curl -fsSL https://apt.releases.hashicorp.com/gpg \
        | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

    CODENAME="$(. /etc/os-release && echo "${VERSION_CODENAME:-}")"
    if [ -z "$CODENAME" ] && command -v lsb_release &>/dev/null; then
        CODENAME="$(lsb_release -cs)"
    fi
    if [ -z "$CODENAME" ]; then
        echo "Could not determine distro codename; falling back to standalone installer..." >&2
    else
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com ${CODENAME} main" \
            | sudo tee /etc/apt/sources.list.d/hashicorp.list > /dev/null

        sudo apt-get update -y
        sudo apt-get install -y terraform

        echo "terraform installed: $(terraform version | head -1)"
        exit 0
    fi
fi

echo "apt-get not found (or unusable); falling back to standalone zip installer..."

ARCH="$(uname -m)"
case "$ARCH" in
    x86_64)         ARCH="amd64" ;;
    aarch64|arm64)  ARCH="arm64" ;;
    armv7l)         ARCH="arm" ;;
    i686|i386)      ARCH="386" ;;
    *)
        echo "Unsupported architecture: $ARCH" >&2
        exit 1
        ;;
esac

if ! command -v unzip &>/dev/null; then
    echo "unzip is required for the standalone installer. Install it and re-run." >&2
    exit 1
fi

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
    echo "Resolving latest Terraform version..."
    VERSION="$(curl -fsSL https://checkpoint-api.hashicorp.com/v1/check/terraform \
        | grep -o '"current_version":"[^"]*"' | cut -d'"' -f4)"

    if [ -z "$VERSION" ]; then
        echo "Could not resolve latest version. Pass one explicitly: ./linux.sh <version>" >&2
        exit 1
    fi
fi

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"
URL="https://releases.hashicorp.com/terraform/${VERSION}/terraform_${VERSION}_linux_${ARCH}.zip"

echo "Downloading Terraform ${VERSION} for linux_${ARCH}..."
curl -fsSL "$URL" -o "${TMPDIR}/terraform.zip"
unzip -q "${TMPDIR}/terraform.zip" -d "$TMPDIR"

if [ -w "$INSTALL_DIR" ]; then
    mv "${TMPDIR}/terraform" "${INSTALL_DIR}/terraform"
else
    sudo mv "${TMPDIR}/terraform" "${INSTALL_DIR}/terraform"
fi
chmod +x "${INSTALL_DIR}/terraform"

echo ""
echo "terraform ${VERSION} installed to ${INSTALL_DIR}/terraform"
terraform version
