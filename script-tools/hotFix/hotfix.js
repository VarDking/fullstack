/**
 * Created by chen on 2017/4/21.
 * 热更新补丁包生成脚本
 */
'use strict';
const fs       = require('fs');
const path     = require('path');
const _        = require('lodash');
const chalk    = require('chalk');
const shell    = require('shelljs');
const baseName = path.basename;

const cmdArgs           = process.argv.splice(2);
const hotFixResourceDir = cmdArgs[0] || '/var/www/mj/hotFix';
const hotFixZipDir      = cmdArgs[1] || './public/hotFix';

class Logger {
    static info(str) {
        console.log(chalk.green(str));
    }

    static error(str) {
        console.log(chalk.red(str));
    }

    static process(str) {
        console.log(chalk.blue(str));
    }
}

/**
 * 列举文件夹目录
 * @param dir
 */
function listDir(dir) {
    return fs.readdirSync(dir).filter(function (file) {
        return file[0] !== '.' && fs.statSync(path.join(dir, file)).isDirectory();
    });
}

/**
 * groupVersionList
 * @param versionList
 */
function groupVersionList(versionList) {
    let versionGroup = _.groupBy(versionList, function (version) {
        return version.split('.').slice(0, 2);
    });
    return _.map(versionGroup, function (group) {
        return group.sort(function (a, b) {
            return needUpdate(a, b) ? -1 : 1;
        });
    });
}

/**
 * 是否需要更新
 * @param oldVersion
 * @param newVersion
 */
function needUpdate(oldVersion, newVersion) {
    if (oldVersion === newVersion) {
        return false;
    }

    oldVersion = oldVersion.split('.');
    newVersion = newVersion.split('.');

    let len = Math.min(oldVersion.length, newVersion.length);

    for (let i = 0; i < len; i++) {
        if (+oldVersion[i] < +newVersion[i]) {
            return true;
        }
    }

    return oldVersion.length < newVersion.length;
}

/**
 * 文件是否存在
 * @param filePath
 * @returns {boolean}
 */
function fileExistSync(filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * 比较文件夹,并生成补丁压缩包
 * @param oldFolder
 * @param newFolder
 * @param newestVersion
 * @param platform
 */
function createHotFixZip(oldFolder, newFolder, newestVersion, platform) {
    let destPath    = `${hotFixZipDir}/${newestVersion}/${platform}`;
    let updateStr   = [baseName(oldFolder), baseName(newFolder)].join('to');
    let destPackage = `${destPath}/${updateStr}.zip`;
    let tmpDir      = `${destPath}/_tmp/`;

    if (fileExistSync(destPackage)) {
        shell.exec(`rm ${destPackage}`);
    }

    if (fileExistSync(tmpDir)) {
        shell.exec(`rm -r ${tmpDir}`);
    }

    shell.exec(`mkdir -p ${tmpDir}`);

    let deltaCmd = `rsync -rc --compare-dest=${oldFolder}/ ${newFolder}/ ${tmpDir}`;
    let zipCmd   = `cd ${tmpDir} && zip -qr ${destPackage} .`;

    shell.exec(deltaCmd);

    Logger.info(`生成压缩包 ${platform} ${updateStr} ...`);
    shell.exec(zipCmd);

    shell.exec(`rm -r ${tmpDir}`);
    return true;
}

/**
 * 生成热更新包
 */
function zip(hotFixResourceDir, platform) {
    Logger.info('start scanning ' + hotFixResourceDir + ' ...... ');

    let groupVersion = groupVersionList(listDir(hotFixResourceDir));
    groupVersion.map(versionList => {
        let newestVersion = _.last(versionList);
        versionList.map(version => {
            if (version === newestVersion) {
                return true;
            }
            let oldFoldPath = path.join(hotFixResourceDir, version);
            let newFoldPath = path.join(hotFixResourceDir, newestVersion);
            if (!fileExistSync(newFoldPath)) {
                shell.exec(`mkdir -p ${newFoldPath}`);
            }
            createHotFixZip(oldFoldPath, newFoldPath, newestVersion, platform);
        });
    });

}

function start() {
    Logger.info('start creating ...');

    ['android', 'ios'].map(platform => {
        return zip(hotFixResourceDir + '/' + platform, platform);
    });

    Logger.info('打包成功！');
}

start();