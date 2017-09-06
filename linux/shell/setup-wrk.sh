#!/bin/bash

## 安装wrk
echo "install wrk"
git clone https://github.com/wg/wrk.git wrk
cd wrk
make -j$(nproc)
cp wrk /usr/local/bin
cd ..
rm -r wrk
echo "install wrk finished"