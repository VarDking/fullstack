## Consul安装
直接下载二进制包或者docker运行
```
cd /tmp
wget https://releases.hashicorp.com/consul/1.5.1/consul_1.5.1_linux_amd64.zip
unzip consul_1.5.1_linux_amd64.zip -d /usr/local/bin
```

修改环境变量
```
vim /etc/profile
export CONSUL_HOME=/usr/local/bin/consul
export PATH=$PATH:CONSUL_HOME

// 使用环境变量配置生效
source /etc/profile

```

验证安装结果
```
consul --version
```

## 常见参数
```
-server	    此标志用于控制代理是运行于服务器/客户端模式，每个 Consul 集群至少有一个服务器，正常情况下不超过5个，使用此标记的服务器参与 Raft一致性算法、选举等事务性工作
-client	    表示 Consul 绑定客户端接口的IP地址，默认值为：127.0.0.1，当你有多块网卡的时候，最好指定IP地址，不要使用默认值
-bootstrap-expect	预期的服务器集群的数量，整数，如 -bootstrap-expect=3，表示集群服务器数量为3台，设置该参数后，Consul将等待指定数量的服务器全部加入集群可用后，才开始引导集群正式开始工作，此参数必须与 -server 一起使用
-data-dir	存储数据的目录，该目录在 Consul 程序重启后数据不会丢失，指定此目录时，应确保运行 Consul 程序的用户对该目录具有读写权限
-node	当前服务器在集群中的名称，该值在整个 Consul 集群中必须唯一，默认值为当前主机名称
-bind	Consul 在当前服务器侦听的地址，如果您有多块网卡，请务必指定一个IP地址（IPv4/IPv6)，默认值为：0.0.0.0，也可用使用[::]
-datacenter	代理服务器运行的数据中心的名称，同一个数据中心中的 Consul 节点必须位于同一个 LAN 网络上
-ui	     启用当前服务器内部的 WebUI 服务器和控制台界面
-join	 该参数指定当前服务器启动时，加入另外一个代理服务器的地址，在默认情况下，如果不指定该参数，则当前代理服务器不会加入任何节点。可以多次指定该参数，以加入多个代理服务器，
-retry-join	用途和 -join 一致，当第一次加入失败后进行重试，每次加入失败后等待时间为 30秒
-syslog	指定此标志意味着将记录 syslog，该参数在 Windows 平台不支持
```

## 启动 consul

```
// 172.16.1.218
consul agent -server -ui -bootstrap-expect=3 -data-dir=/data/consul -node=agent-1 -client=0.0.0.0 -bind=172.16.1.218 -datacenter=dc1

// 172.16.1.219
consul agent -server -ui -bootstrap-expect=3 -data-dir=/data/consul -node=agent-2 -client=0.0.0.0 -bind=172.16.1.219 -datacenter=dc1 -join 172.16.1.218

// 172.16.1.220
consul agent -server -ui -bootstrap-expect=3 -data-dir=/data/consul -node=agent-3 -client=0.0.0.0 -bind=172.16.1.220 -datacenter=dc1 -join 172.16.1.218

```

## 其他工具
- consul-template https://github.com/hashicorp/consul-template
- Registrator 


## 参考
- consul 支持多数据中心的服务发现与配置共享工具  https://www.jianshu.com/p/3d074ed76a68
- consul 负载均衡  https://tonybai.com/2018/09/10/setup-service-discovery-and-load-balance-based-on-consul/
- istio https://tonybai.com/2018/01/03/an-intro-of-microservices-governance-by-istio/
- Consul + fabio 实现自动服务发现、负载均衡 http://dockone.io/article/1567
- consul 支持多数据中心 https://www.jianshu.com/p/3d074ed76a68?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
- consul 支持多数据中心的服务发现与配置共享工具 https://deepzz.com/post/the-consul-of-discovery-and-configure-services.html