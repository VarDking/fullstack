#!/bin/bash
## 安装pip

set -e

# root 权限
if [ "$(id -u)" != "0" ]; then
echo "This script must be run as root" 1>&2
exit 1
fi

if ! command -v python > /dev/null 2>&1; then
	apt-get install python
fi

wget "https://bootstrap.pypa.io/get-pip.py" && python get-pip.py
rm get-pip.py