/**
 * Created by vd on 06/09/17.
 */
'use strict';
const Gauge = require("gauge");

const gauge = new Gauge();
gauge.show("test", 1000);
gauge.pulse("this");
gauge.hide();