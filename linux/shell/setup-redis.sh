#!/bin/bash
## 安装redis-server

# root 权限
if [ "$(id -u)" != "0" ]; then
echo "This script must be run as root" 1>&2
exit 1
fi

version=""

mkdir _install
cd _install
wget "http://download.redis.io/releases/redis-${version}.tar.gz"
tar xzvf redis-stable.tar.gz

make && make install

mkdir /etc/redis

# 添加用户
adduser --system --group --no-create-home redis
mkdir -p /var/lib/redis
chown redis:redis /var/lib/redis
chmod 770 /var/lib/redis

cp redis-stable/redis.conf /etc/redis

## 手动修改配置文件
#supervised systemd
#dir /var/lib/redis

# touch /etc/systemd/system/redis.service
systemctl start redis

# 开机启动
systemctl enable redis