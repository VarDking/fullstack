#!/bin/bash

#基本开发环境
echo "installing git, wget, curl, build-essential, rsync, pkg-config, python..."
bash -c "apt-get install -qq -y git wget curl build-essential libssl-dev rsync pkg-config python < /dev/null" > /dev/null 2>/dev/null