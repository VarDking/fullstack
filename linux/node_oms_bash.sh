#!/bin/bash
PROJECT_NAME=logstics #发布路径使用的是logstics(拼错单词了,囧)
PROJECT_PATH=/var/www/websync/logstics/
PROJECT_RUNNING_PATH=${PROJECT_PATH}running/
LOG_PATH=/var/webos/logs/logstics

set -e

VERSION=
ACTION=
PACKAGE_NAME=
LOG_FILE_NAME=

function usage()
{
    echo "参数说明:"
    echo "[-?] 获取帮助信息"
    echo "[-a ACTION] [env|install|start|update|restart|del|version|state|dep|currv|log]" 
    echo "             env 运行环境信息 " 
    echo "             install 安装依赖包 " 
    echo "             currv 当前运行版本 " 
    echo "             state pm2 项目状态" 
    echo "             dep 获取依赖版本信息" 
    echo "             log 查看日志信息" 
    echo "[-v VERSION] 项目版本 20160909"
    echo "[-p PROJECT_PATH]指定项目路径"
    echo "[-f LOG_FILE_NAME]日志"
    echo "[-d DEPENDENCY PACKAGE_NAME] 依赖包的名称 ejs@2.1"
    exit 1
}

function baseRuntimeEnv()
{
    echo "node version: "`node -v`
    nginx -v
    mysql -V
    redis-server -v
}

function installDependecies()
{
  cd ${PROJECT_PATH}  
  if [ "$PACKAGE_NAME" == "all" ]; then
      npm install
      echo "安装依赖成功"
  else 
      npm install ${PACKAGE_NAME}
      echo "安装依赖成功 "$PACKAGE_NAME
  fi
}

function dependencyVersion()
{
    cd ${PROJECT_PATH}
    echo $(cat ./node_modules/${PACKAGE_NAME}/package.json | grep version)
}

function startServer()
{
    cd $PROJECT_PATH
    if [ ! $VERSION ];then
        echo "请指定项目版本"
        exit 1
    fi

    cp ${VERSION}/package.json ./
    cp -r ${VERSION}/* ${PROJECT_RUNNING_PATH}; 
    cd $PROJECT_RUNNING_PATH
    echo $VERSION > version 
    
    pm2 start pm2-config.json 
    pm2 start cron.js --name ${PROJECT_NAME}-crontab
    pm2 ls
    echo "启动服务成功"
}

function restart()
{
   pm2 restart ${PROJECT_NAME}
   pm2 restart ${PROJECT_NAME}-crontab
   echo $PROJECT_NAME-crontab
}

function delete()
{
    pm2 delete ${PROJECT_NAME}
}

#更新或回滚
function update()
{

    cd $PROJECT_PATH
    if [ ! $VERSION ];then
        echo "请指定项目版本"
        exit 1
    fi

    cp ${VERSION}/package.json ./
    cp -r ${VERSION}/* ${PROJECT_RUNNING_PATH}; 
    cd $PROJECT_RUNNING_PATH
    echo $VERSION > version 

    echo "成功更新项目"
}

function serverState()
{
    pm2 ls
}

function pm2logs()
{
    pm2 logs ${PROJECT_NAME}    
}

function logviewer()
{
    cd ${LOG_PATH}
    if [ ! ${LOG_FILE_NAME} ];then
        LOG_FILE_NAME=log.`date +%Y-%m-%d`
    fi
    echo "logfile name is ：$LOG_FILE_NAME" 
    tail -f ${LOG_FILE_NAME}
}

function versionList()
{
    cd $PROJECT_PATH
    versions=$(ls | grep '[0-9]')
    echo $versions;
}

function currentVersion()
{
    cat ${PROJECT_RUNNING_PATH}/version
}

while getopts :a:v:p:d:f: option
do 
    case $option in 
        a)
            ACTION=$OPTARG
            ;;
        v)
            VERSION=$OPTARG
            ;;
        p)
            PROJECT_PATH=$OPTARG
            ;;
        d)
            PACKAGE_NAME=$OPTARG
            ;;
        f)
            LOG_FILE_NAME=$OPTARG
            ;;
        ?)
            usage
            ;;
    esac
done

function main()
{
    case $ACTION in 
        env)
            baseRuntimeEnv
            ;;
        install)
            installDependecies
            ;;
        state)
            serverState
            ;;
        dep)
            dependencyVersion
            ;;
        start)
            startServer
            ;;
        update)
            update
            ;;
        restart)
            restart
            ;;
        version)
            versionList
            ;;
        curr)
            currentVersion
            ;;
        log)
            if [ ! $LOG_FILE_NAME ];then
                pm2logs
            else
                logviewer
            fi
            ;;
        *)
            usage
            ;;
    esac
}

main
