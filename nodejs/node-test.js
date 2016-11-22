/**
 * Created by admin on 2016/11/16.
 * 打卡数据
 */
"use strict";
const fs      = require('fs');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));

module.exports = {
    deptClockData: deptClockData
};

function deptClockData(deptid, start, end) {
    return request.postAsync({
        url : 'http://10.32.64.26:8011/Card.aspx',
        json: true,
        body: {
            act     : '804',
            startime: start,
            endtime : end,
            deptid  : String(deptid),
            portkey : 'c2f65e2bb6f74b3bbb2c163485b27d37'
        }
    }).then(result=> {
        console.log('result.body',result.body);
        if (result.body && result.body.code) {
            return result.body.message;
        } else {
            return Promise.reject('请求运维接口失败！');
        }
    });
}

deptClockData('1500406', '2016-11-21', '2016-11-21').then(console.log);
