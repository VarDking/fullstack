# 压缩vmware磁盘备忘

# 在linux系统中删除掉不再需要的文件
apt-get clean

# 用0填充剩余空间
cat /dev/zero > zero.fill;sync;sleep 1;sync;rm -f zero.fill

# 宿主机器执行磁盘管理命令
vmware-vdiskmanager.exe -k debian.vmdk