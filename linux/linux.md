###linux

#### 常用命令
- dd  
	dd 是 Linux/UNIX 下的一个非常有用的命令，作用是用指定大小的块拷贝一个文件，并	在拷贝的同时进行指定的转换。

	```
	    //创建一个1k的空文件
		dd if=/dev/zero of=./test.txt bs=1k count=1
	```  
	ibs = bytes 。 输入，一次写入缓冲区的字节数   
	obs = bytes 。 输出，一次写入缓冲区的字节数  
	skip = blocks 跳过读入缓冲区开头的ibs*blocks块  
	bs = bytes 同时设置ibs和obs  
	cbs = bytes 一次转换的byte数  
	count = blocks 只拷贝输入的block块  
	conv = ASCII 把EBCDIC转换为ASCII   
	conv = ebcdic 把ASCII转换成EBCDIC  
	
	**dd 和 cp 的区别**   
	cp 以字节方式读取文件，dd以扇区读取文件   
	dd最大的用处是进行格式化和格式转换。   
	若用cp，只是将hda的文件复制到hdb上，顺序上会不一样。  

	```
		//将第一块硬盘里的数据复制到第二块硬盘上。
		//hda和hdb磁盘数据每个扇区的数据都一样
		//if input file, of output file
		dd if=/dev/hda of=/dev/hdb bs=4 count=1024
	```
   
- sed  
	sed是非交互编辑器。不会修改文件，默认情况是把所有的输出行打印在屏幕上。  
	
- ssh  
	登录堡垒机  
	
	```
		Host p-sg
    	Hostname 46.52.103.178
    	User vardking
    	Port 29540
    	ProxyCommand ssh vardking@128.185.4.24 -p 123 nc %h %p
	```
#### swapfile
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
     
     ```
     echo 'vm.swappiness=30' >> /etc/sysctl.conf
     ```
     
           