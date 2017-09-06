/**
 * Created by vd on 06/09/17.
 */
'use strict';
const ProgressBar = require('progress');
const bar         = new ProgressBar(':bar:percent', {total: 100});

const timer = setInterval(function () {
    bar.tick();
    if (bar.complete) {
        console.log('\ncomplete\n');
        clearInterval(timer);
    }
}, 100);