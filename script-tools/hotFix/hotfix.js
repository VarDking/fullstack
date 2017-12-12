/**
 * Created by chen on 2017/4/21.
 * 热更新补丁包生成脚本
 */
'use strict';
var fs         = require('fs');
var walk       = require('walk');
var path       = require('path');
var hasha      = require('hasha');
var async      = require('async');
var archiver   = require('archiver');
var underscore = require('underscore');
var baseName   = path.basename;

var cmdArgs           = process.argv.splice(2);
var hotFixResourceDir = cmdArgs[0] || '/var/www/mj/hotFix';
var hotFixZipDir      = cmdArgs[1] || './public/hotFix';


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
    var versionGroup = underscore.groupBy(versionList, function (version) {
        return version.split('.').slice(0, 2);
    });
    return underscore.map(versionGroup, function (group) {
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
    if ( oldVersion === newVersion ) {
        return false;
    }

    oldVersion = oldVersion.split('.');
    newVersion = newVersion.split('.');

    var len = Math.min(oldVersion.length, newVersion.length);

    for (var i = 0; i < len; i++) {
        if ( +oldVersion[i] < +newVersion[i] ) {
            return true;
        }
    }

    return oldVersion.length < newVersion.length;
}

/**
 * 计算文件的md5值
 * @param filePath
 * @param cb
 */
function fileMd5(filePath, cb) {
    hasha.fromFile(filePath, {algorithm: 'md5'}).then(function (hashNum) {
        return cb(null, hashNum);
    }).catch(cb);
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
 * 简单判断文件是否存在(异步)
 * @param filePath
 * @param cb
 */
function fileExist(filePath, cb) {
    fs.access(filePath, function (err) {
        err ? cb(null, false) : cb(null, true);
    });
}

/**
 * 比较文件夹,并生成补丁压缩包
 * @param oldFolder
 * @param newFolder
 * @param platform
 * @param cb
 */
function createHotFixZip(oldFolder, newFolder, platform, cb) {
    var updateStr   = [baseName(oldFolder), baseName(newFolder)].join('to');
    var zipFileName = updateStr + '.zip';
    // var zipFileName = hasha(updateStr, {algorithm : 'md5'}) + '.zip';

    if ( fileExistSync(zipFileName) ) {
        return cb(null, zipFileName);
    }

    var outPut  = fs.createWriteStream(path.join(hotFixZipDir, platform, zipFileName));
    var archive = archiver('zip', {store: true});
    archive.pipe(outPut);

    walk
        .walk(newFolder, {followLinks: false})
        .on('file', function (root, stat, next) {
            var filePath    = path.join(root, stat.name).substr(newFolder.length);
            var newFilePath = path.join(newFolder, filePath);
            var oldFilePath = path.join(oldFolder, filePath);

            fileExist(oldFilePath, function (err, hasFile) {
                if ( !hasFile ) {
                    archive.file(newFilePath, {name: newFilePath.substr(newFolder.length)});
                    return next();
                }
                async.map(
                    [newFilePath, oldFilePath],
                    fileMd5,
                    function (err, results) {
                        if ( err ) {
                            return next(err);
                        }
                        if ( results[0] !== results[1] ) {
                            archive.file(newFilePath, {name: newFilePath.substr(newFolder.length)});
                        }
                        next();
                    });
            });
        })
        .on('end', function () {
            archive.finalize();
            cb(null, zipFileName);
        })
        .on('error', cb)
}

/**
 * 生成热更新包
 */
function zip(hotFixResourceDir, platform, cb) {
    console.log('start scanning ' + hotFixResourceDir + ' ...... ');

    async.each(groupVersionList(listDir(hotFixResourceDir)), function (versionList, cb) {
        var newestVersion = versionList[versionList.length - 1];
        async.each(versionList, function (version, cb) {
            if ( version === newestVersion ) {
                return cb(null);
            }
            var oldFoldPath = path.join(hotFixResourceDir, version);
            var newFoldPath = path.join(hotFixResourceDir, newestVersion);

            console.log('creating zip, from', oldFoldPath + ' => ' + newFoldPath);
            createHotFixZip(oldFoldPath, newFoldPath, platform, cb);
        }, cb);
    }, cb);

}

function start() {
    console.log('start creating ...');
    async.each([hotFixResourceDir + '/ios', hotFixResourceDir + '/android'], function (path, cb) {
        var platform = path.substring(path.lastIndexOf('/')+1);
        return zip(path, platform, cb);
    }, function (err) {
        if ( err ) {
            return console.error(err);
        }
        console.log('success, finished!')
    });
}

start();
