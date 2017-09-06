/**
 * Created by vd on 06/09/17.
 */
'use strict';
const ora = require('ora');

const spinner = ora({
    spinner: 'growHorizontal'
}).start();

setInterval(() => {
    spinner.color = 'red';
    spinner.text  = 'Loading rainbows';
}, 1000);

setInterval(() => {
    spinner.color = 'green';
    spinner.text  = 'Loading rainbows';
}, 600);