#!/bin/bash
#快速安装开发环境

set -e

if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# update sys
echo "updating apt-get..."
bash -c "apt-get update -qq -y < /dev/null" > /dev/null

echo "installing git, wget, curl, build-essential, rsync, pkg-config, python..."
bash -c "apt-get install -qq -y git wget curl build-essential rsync pkg-config python < /dev/null" > /dev/null 2>/dev/null