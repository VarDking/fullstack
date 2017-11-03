# !/bin/sh
# 热更新生成脚本
# $1 地区 $2 svn版本号 $3 版本号
# 使用示例 bash hotFix.sh shandong 1005 1.2.25

set -e

if [ ! $1 ] || [ ! $2 ] || [ ! $3 ]; then
	echo "参数错误！ 使用示例 bash hotFix.sh [地区名] [svn版本号] [游戏版本号]" 1>&2
	exit 1
fi

assetsPath=/data/services/majiang/StreamingAssets;
updateAssetsPath=/data/services/majiang/update;
majiangPath=/data/services/majiang/server/trunk;
hotfixPackageDestPath=${majiangPath}/web-server/public/hotFix/$1;

# 确保文件夹存在
[ ! -d "${updateAssetsPath}" ] && mkdir -p ${updateAssetsPath};
[ ! -d "${hotfixPackageDestPath}" ] && mkdir -p ${hotfixPackageDestPath};
[ ! -d "${hotfixPackageDestPath}/android" ] && mkdir -p ${hotfixPackageDestPath}/android;
[ ! -d "${hotfixPackageDestPath}/ios" ] && mkdir -p ${hotfixPackageDestPath}/ios;

# 从svn 检出 StreamingAssets
if [ $2 ] && [ $2 -gt 0 ]; then
   cd ${assetsPath};
   svn up -r $2;
   find . -type f -name "*.meta" -exec rm -rf {} \;
fi

# 创建地区目录
cd ${majiangPath}/web-server/public/hotFix
mkdir -p $1/android
mkdir -p $1/ios

# 复制资源文件
cd ${updateAssetsPath}
mkdir -p $1/android/
cd $1/android/
rm -rf $3
mkdir -p $3

cd ${assetsPath}
cp -fRp config ${updateAssetsPath}/$1/android/$3/
cp -fRp Lua_1 ${updateAssetsPath}/$1/android/$3/
cp -fRp Android ${updateAssetsPath}/$1/android/$3/

cd ${updateAssetsPath}
mkdir -p $1/ios/
cd $1/ios/
rm -rf $3
mkdir -p $3

cd ${assetsPath}
cp -fRp config ${updateAssetsPath}/$1/ios/$3/
cp -fRp Lua_1 ${updateAssetsPath}/$1/ios/$3/
cp -fRp iOS/AssetBundles ${updateAssetsPath}/$1/ios/$3/


# 清理文件
cd ${updateAssetsPath}/$1
find . -type f -name ".DS_Store" -exec rm -rf {} \;
find . -type d -name ".svn" -prune -exec rm -rf {} \;

cd ${majiangPath}/web-server
node hotfix.js ${updateAssetsPath}/$1 ${hotfixPackageDestPath}

# 修复zip文件格式
function rezip(){
 mkdir tmp
 for f in *zip; do
     cd tmp
     rm -rf *
     unzip ../"$f"
     rm -r ../"$f"
     zip -r ../"$f" *
     rm -rf *
     cd ..
 done
 rm -r tmp
}

cd ${hotfixPackageDestPath}/ios
rezip;

cd ${hotfixPackageDestPath}/android
rezip;

echo "热更新文件生成成功！";

