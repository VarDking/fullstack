#!/bin/bash
## 安装pip

if ! command -v python > /dev/null 2>&1; then
	apt-get install python
fi

python -e "$(curl -fsSL https://bootstrap.pypa.io/get-pip.py)"