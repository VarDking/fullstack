###linux

#### 常用命令
- dd  
	- dd 是 Linux/UNIX 下的一个非常有用的命令，作用是用指定大小的块拷贝一个文件，并	在拷贝的同时进行指定的转换。

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
	
	- **dd 和 cp 的区别**   
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
	- 重启ssh服务
	  
	  ```
	  　// ubuntu系统
	  　service ssh restart
	  　// debian系统
	  　/etc/init.d/ssh restart
	  ```
	  
	- ssh可以执行远程操作   
	  
	  ```
	  　$ ssh user@host 'mkdir -p .ssh && cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub
	  　$ cd && tar czv src | ssh user@host 'tar xz' //复制home下src所有文件到远程主机
	  　$ ssh user@host 'tar cz src' | tar xzv //复制远程主机文件到本机
	  　$ ssh user@host 'ps ax | grep [h]ttpd' //查看远程主机是否有httpd进程
	  　
	  ```
	  
	  远程调用tcpdump抓包,通过管道回传，然后用wireshark抓包  
	
		```
		$ ssh dev "sudo tcpdump -s 0 -U -n -i eth0 not port 22 -w -" | wireshark -k -i -
		```
	  
	-  绑定端口  
		
		```
		$ ssh -D 8080 user@host
		```
	
		SSH会建立一个socket，去监听本地的8080端口。一旦有数据传向那个端口，就自动把它转移到SSH连接上面，发往远程主机。可以想象，如果8080端口原来是一个不加密端口，现在将变成一个加密端口。  
		
	- 本地端口转发
		
		```
		$ ssh -L 2121:host2:21 host3
		```
		命令中的L参数一共接受三个值，分别是"本地端口:目标主机:目标主机端口"，   
		其中,目标主机是针对host3而言的。  
	
		绑定2121端口，指定host3将所有数据转发到目标主机21端口  
		
		``` 
		$ ftp localhost:2121  //此时实际是连接到host2的ftp
		$ ssh -L 5900:localhost:5900 host3  //本机5900端口绑定到host3 5900端口
		```
		
	- 远程端口  
		host1 host2直接无法连接  
		host3为内网机，可以连接到host1和host2，反过来不行。          
		
		R参数也是接受三个值，分别是"远程主机端口:目标主机:目标主机端口"。   
		
		```
		//host3上执行
		$ ssh -R 2121:host2:21 host1
		//host1上执行
		$ ftp localhost:2121
		```
		让host1监听它自己的2121端口，然后将所有数据经由host3，转发到host2的21端口。   
		对于host3来说，host1是远程主机，所以这种情况就被称为"远程端口绑定"。  
	
	- 登录堡垒机  
	
		```
		Host p-sg
    	Hostname 46.52.103.178
    	User vardking
    	Port 29540
    	ProxyCommand ssh vardking@128.185.4.24 -p 123 nc %h %p
		```
		
	- 其他参数  
		
		N参数，表示只连接远程主机，不打开远程shell；T参数，表示不为这个连接分配TTY。这个两个参数可以放在一起用，代表这个SSH连接只用来传数据，不执行远程操作。  
		
		```
		$ ssh -NT -D 8080 host  //
		```
		
		f参数，表示SSH连接成功后，转入后台运行。这样一来，你就可以在不中断SSH连接的情况下，在本地shell中执行其他操作。  
		
		```
		$ ssh -f -D 8080 host
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
     
           