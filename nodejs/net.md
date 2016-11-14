#Nodejs文档

##Net

###Class: net.Server

```language
Event: 'close'
Event: 'connection'
Event: 'error'
Event: 'listening'
server.address()     //返回绑定地址,address family name 和 端口。示例:{ port: 12346, family: 'IPv4', address: '127.0.0.1' }
server.close([callback]) 			//停止接受新的连接。直到所有连接关闭后发送close事件。
server.connections       			//Deprecated.返回当前连接数
server.getConnections(callback) 	//当前连接数
server.listen(handle[, backlog][, callback])
server.listen(options[, callback])
server.listen(path[, backlog][, callback])
server.listen([port][, hostname][, backlog][, callback])
server.listening     				 //返回是否在监听。
server.maxConnections 				 //允许连接的最大请求数量
server.ref()          				 //最后一个server关闭后程序不退出
server.unref()       				 //最后一个server关闭后程序退出
```

### Class: net.Socket

```language
new net.Socket([options])    		//创建一个socket
 options {
  			fd: null,               //指向一个已经存在的socket 文件描述符
  			allowHalfOpen: false,   //默认false。参考end事件
 			readable: false,
 			writable: false
		}

Event: 'close'          // socket完全关闭时触发close事件，参数had_error：是否有错误
Event: 'connect'        // socket成功连接时触发
Event: 'data'           // 接受到数据时触发。参数data：buffer或string类型。data的编码由socket.setEncoding()方法设置。注意：当socket触发data事件后却没有处理该数据，会造成数据丢失。
Event: 'drain'          // 当write buffer变空时触发。能够用来限制上传。
Event: 'end'            // 当连接的另一段发送FIN报文时触发该事件。默认会销毁socket文件描述符。如果allowHalfOpen=true，则不会销毁socket文件描述符，此时用户仍然可以写入数据，直到用户主动调用end()访问.
Event: 'error'          // 发生错误时触发该事件。紧接着触发 close事件
Event: 'lookup'         // resolve hostname后建立连接前触发。不适用与unix socket。
Event: 'timeout'        // 超时。只是提醒用户socket已经空闲，用户需手动关闭连接。
socket.address()        // 返回绑定地址
socket.bufferSize
socket.bytesRead
socket.bytesWritten
socket.connect(options[, connectListener])
socket.connect(path[, connectListener])
socket.connect(port[, host][, connectListener])
socket.connecting
socket.destroy([exception])
socket.destroyed
socket.end([data][, encoding])
socket.localAddress
socket.localPort
socket.pause()
socket.ref()
socket.remoteAddress
socket.remoteFamily
socket.remotePort
socket.resume()
socket.setEncoding([encoding])
socket.setKeepAlive([enable][, initialDelay])
socket.setNoDelay([noDelay])       //停用Nagle算法。默认启用，会先缓冲数据，然后发送。设置为false后，没当write方法调用，数据会立即被发出
socket.setTimeout(timeout[, callback])      //设置超时时间。默认没有限制。
socket.unref()                              // 当前socket若为event system中最后一个socket，程序将会退出
socket.write(data[, encoding][, callback])  //写入数据。如果全部数据写入了 kernel buffer返回true，如果有数据在用户内存中排队，则返回false。buffer为空后会发送drain事件。
```