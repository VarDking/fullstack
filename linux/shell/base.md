###shell编程

```language
name="v4.5.0"
echo ${#name}  # 获取字符串长度
echo ${name#v} # 替换v为空
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
-eq -ne -ge -gt -le -lt

####字符串变量

```
if  [ $a = $b ]        # a等于b
if  [ $a !=  $b ]      # a不等于b
if  [ -n $a  ]         # a 非空(非0），返回0(true)
if  [ -z $a  ]         # a 为空
if  [ $a ]             # a 非空，返回0 (和-n类似）
```
