#!/bin/bash
## 安装pip

set -e

if ! command -v python > /dev/null 2>&1; then
	apt-get install python
fi

wget "https://bootstrap.pypa.io/get-pip.py" && python get-pip.py
rm get-pip.py