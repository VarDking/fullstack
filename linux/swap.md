# swapfile
1. 创建swap文件

	```
	# dd if=/dev/zero of=/swapfile bs=1024 count=524288  //创建512M文件 	512*1024
	# chown root:root /swapfile
	# chmod 0600
	# mkswap /swapfile
	# swapon /swapfile
	# vim /etc/fstab
	# /swapfile none swap sw 0 0
	```
2. 查看swap使用
	```
	# free -m
	# swapon -s           //display swap usage
	# grep -i --color Swap /proc/meminfo
	```
3. 关闭swap功能
	- 关闭文件的swap功能
	  ```
	  # swapoff /swapfile1
	  # swapon -s
	  ```
	- 关闭linux swap功能
	  临时修改
	  ```
	  # sysctl vm.swappiness=VALUE
	  # sysctl vm.swappiness=20  //value值越高，置换越激烈，默认60

	  or
	  
	  # sysctl vm.swappiness=VALUE
	  # sysctl vm.swappiness=20
	  ```
     永久修改：
     
     ```js
     echo 'vm.swappiness=30' >> /etc/sysctl.conf
     ```