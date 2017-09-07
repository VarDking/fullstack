#!/bin/bash
## debian系统上源码安装gm

set -e

# 测试安装了1.3.22
version="1.3.22"
tmp_path="$(pwd)/.auto_install"

# root 权限
if [ "$(id -u)" != "0" ]; then
echo "This script must be run as root" 1>&2
exit 1
fi

echo "开始安装"
# 开发环境
apt-get install make git g++ gcc zlib1g zlib1g-dev libxml2 libxml2-dev -y

# 安装依赖库
mkdir ${tmp_path} && cd ${tmp_path}

# 支持webp格式
wget http://downloads.webmproject.org/releases/webp/libwebp-0.4.3.tar.gz
tar -xvzf libwebp-0.4.3.tar.gz
cd libwebp-0.4.3
./configure --prefix=/usr/local/libwebp
make && make install
cd ${tmp_path}

# 支持jpeg格式
wget http://www.ijg.org/files/jpegsrc.v9a.tar.gz
tar -xzvf jpegsrc.v9a.tar.gz
cd jpeg-9a
./configure --prefix=/usr/local/libjpeg-9a
make && make install
cd ${tmp_path}

# 支持png格式
wget http://download.sourceforge.net/libpng/libpng-1.6.18.tar.gz
tar -xzvf libpng-1.6.18.tar.gz
cd libpng-1.6.18
./configure --prefix=/usr/local/libpng
make && make install
cd ${tmp_path}

# 支持 tiff
wget http://download.osgeo.org/libtiff/tiff-4.0.4.tar.gz
tar -xzvf tiff-4.0.4.tar.gz
cd tiff-4.0.4
./configure --prefix=/usr/local/libtiff
make && make install
cd ${tmp_path}

# 安装GraphicsMagick
wget http://download.sourceforge.net/graphicsmagick/GraphicsMagick-1.3.22.tar.gz
tar -xzvf GraphicsMagick-1.3.22.tar.gz
cd GraphicsMagick-1.3.22
./configure \
  LDFLAGS="-L/usr/local/libjpeg/lib -L/usr/local/libpng/lib -L/usr/local/libtiff/lib" \
  CPPFLAGS="-I/usr/local/libjpeg/include -I/usr/local/libpng/include -I/usr/local/libtiff/include"

make && make install && make check
cd ${tmp_path}/../

# 重载动态链接库
ldconfig

rm -r ${tmp_path}
echo "安装成功"