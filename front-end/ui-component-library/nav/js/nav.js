;$(function () {
    'use strict';
    // Mobile navigation
    $('.nav-trigger').on('click', function () {
        var nav     = $('.nav-group');
        var trigger = $('.nav-trigger');

        trigger.toggleClass('active');
        nav.toggleClass('active');
    });
});