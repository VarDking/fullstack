#!/bin/bash
# written by Mr.chen.
# install node.js

# 默认8.4.0
version=${1-"8.9.0"}

#操作确认
read -p "是否确认移除旧版Node.js ? (yN)" SURE

if ! [ "x$SURE" = "xy" ] && ! [ "x$SURE" = "xY" ]; then
  echo "script exited"
  exit 1
fi

# root 权限
if [ "$(id -u)" != "0" ]; then
echo "This script must be run as root" 1>&2
exit 1
fi

# 卸载node
rm -r /usr/local/bin/node
rm -r /usr/local/bin/npm
rm -r /usr/local/bin/npx
rm -r /usr/local/share/doc/node
rm -r /usr/local/share/man/man1/node*
rm -r /usr/local/lib/node_modules/npm

# 卸载node依赖(非必须)
#rm -r /usr/local/include/node 
#rm -r /usr/local/lib/node_modules
#rm -r ~/.npm ~/.node-gyp

# 安装二进制包
echo "install node v${version}"
tmp_path=~/_install_tmp
mkdir -p ${tmp_path}
cd ${tmp_path}
#wget https://nodejs.org/dist/v${version}/node-v${version}-linux-x64.tar.gz
wget https://npm.taobao.org/mirrors/node/v${version}/node-v${version}-linux-x64.tar.gz

cd /usr/local
tar --strip-components 1 -xzf ${tmp_path}/node-v${version}-linux-x64.tar.gz
rm -r ${tmp_path}
echo "install node v${version} finished"