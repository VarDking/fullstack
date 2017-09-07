###shell编程

```language
name="v4.5.0"
echo ${#name}  # 获取字符串长度
echo ${name#v} # 替换v为空
```

####特殊变量

```
$$  	# Shell本身的PID（ProcessID)
$!  	# Shell最后运行的后台Process的PID
$?  	# 最后运行的命令的结束代码（返回值)
$*  	# 所有参数列表。如"$*"用「"」括起来的情况、以"$1 $2 … $n"的形式输出所有参数。
$@  	# 所有参数列表。如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数。
$#  	# 参数个数
$0  	# Shell文件名
$1～$n  # 添加到Shell的各参数值。$1是第1参数、$2是第2参数…。s
```

####文件表达式

```
if [ -f  file ]    	# 文件存在
if [ -d ...   ]    	# 目录存在
if [ -s file  ]    	# 文件存在且非空
if [ -r file  ]    	# 文件存在且可读
if [ -w file  ]    	# 文件存在且可写
if [ -x file  ]    	# 文件存在且可执行
```

示例：

```
test -f "/usr/local/curl" && echo "curl is exist"
```

####整数变量表达式

```
-eq -ne -ge -gt -le -lt
```

####字符串变量

```
if  [ $a = $b ]        # a等于b
if  [ $a !=  $b ]      # a不等于b
if  [ -n $a  ]         # a 非空(非0），返回0(true)
if  [ -z $a  ]         # a 为空
if  [ $a ]             # a 非空，返回0 (和-n类似）
```

####trap
脚本捕捉信号并处理  
常用的信号值1，2，3，15  
1－－－－SIGHUP     挂起或父进程被杀死  
2－－－－SIGINT     来自键盘的中断<CTRL + C>  
3－－－－SIGQUIT    从键盘退出  
15－－－－SIGTERM   软终止  

```
trap name signal(s)
```

####获取当前用户

```
id -u  // root:0
whoami //当前用户
```
####双中括号

```
 name="ubuntu"
 if [[ $name = *buntu* ]];then
 	echo "matched"
```

