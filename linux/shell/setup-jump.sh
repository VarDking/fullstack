#!/bin/bash

# 命令行快速跳转
echo "install jump"
wget https://github.com/gsamokovarov/jump/releases/download/v0.13.0/jump_0.13.0_amd64.deb
dpkg -i jump_0.13.0_amd64.deb
rm jump_0.13.0_amd64.deb
echo "install jump finished"