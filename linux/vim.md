##vim的基本使用

#### 缓冲区

> A buffer is an area of Vim’s memory used to hold text read from a file. In addition, an empty buffer with no associated file can be created to allow the entry of text. –vim.wikia

```language
//打开多个文件放入缓冲区
vim a.txt b.txt
//缓冲区跳转
:ls, :buffers                "列出所有缓冲区
:bn[ext]                     "下一个缓冲区
:bp[revious]                 "上一个缓冲区
:b {number, expression}      "跳转到指定缓冲区
//分屏
:sb 3                        "分屏并打开编号为3的Buffer
:vertical sb 3               "同上，垂直分屏
:vertical rightbelow sfind file.txt
//缓冲区模糊匹配跳转
:b <Tab>                     " 显示所有Buffer中的文件
:b car<Tab>                  " 显示 car.c car.h
:b *car<Tab>                 " 显示 car.c jetcar.c car.h jetcar.h
:b .h<Tab>                   " 显示 vehicle.h car.h jet.h jetcar.h
:b .c<Tab>                   " 显示 vehicle.c car.c jet.c jetcar.c
:b ar.c<Tab>                 " 显示 car.c jetcar.c
:b j*c<Tab>                  " 显示 jet.c jetcar.c jetcar.h
//设置快捷键
noremap <c-n> :b <c-z>
```

###标签页

```language
//打开文件
vim -p main.cpp my-oj-toolkit.h /private/etc/hosts
//打开与关闭标签页
:tabe[dit] {file}   edit specified file in a new tab
:tabf[ind] {file}   open a new tab with filename given, searching the 'path' to find it
:tabc[lose]         close current tab
:tabc[lose] {i}     close i-th tab
:tabo[nly]          close all other tabs (show only the current tab)
//标签跳转
:tabn         go to next tab
:tabp         go to previous tab
:tabfirst     go to first tab
:tablast      go to last tab
gt            go to next tab
gT            go to previous tab
{i}gt         go to tab in position
//设置快捷键
noremap <C-L> <Esc>:tabnext<CR>
noremap <C-H> <Esc>:tabprevious<CR>
```

### 分屏
```language
//分屏
:sp[lit] {file}     水平分屏
:new {file}         水平分屏
:sv[iew] {file}     水平分屏，以只读方式打开
:vs[plit] {file}    垂直分屏
:clo[se]            关闭当前窗口
//快捷键
Ctrl+w s        水平分割当前窗口
Ctrl+w v        垂直分割当前窗口
Ctrl+w q        关闭当前窗口
Ctrl+w n        打开一个新窗口（空文件）
Ctrl+w o        关闭出当前窗口之外的所有窗口
Ctrl+w T        当前窗口移动到新标签页
//切换窗口
Ctrl+W h        切换到左边窗口
Ctrl+W j        切换到下边窗口
Ctrl+W k        切换到上边窗口
Ctrl+W l        切换到右边窗口
Ctrl+W w        遍历切换窗口
//窗口位置切换
Ctrl+w H|J|K|L
```

###搜索
vimgrep /匹配模式/[g][j] 要搜索的文件/范围   
g：表示是否把每一行的多个匹配结果都加入
j：表示是否搜索完后定位到第一个匹配位置

```
vimgrep /pattern/ %           在当前打开文件中查找
vimgrep /pattern/ *           在当前目录下查找所有
vimgrep /pattern/ **          在当前目录及子目录下查找所有
vimgrep /pattern/ *.c         查找当前目录下所有.c文件
vimgrep /pattern/ **/*        只查找子目录

cn                            查找下一个
cp                            查找上一个
copen                         打开quickfix
cw                            打开quickfix
cclose                        关闭qucikfix
help vimgrep                  查看vimgrep帮助
```

###折叠

```
" 基于缩进或语法进行代码折叠
set foldmethod=indent
set foldmethod=syntax
" 启动 vim 时关闭折叠代码
set nofoldenable
za  打开或关闭当前折叠 
zM  关闭所有折叠 
zR  打开所有折叠
```