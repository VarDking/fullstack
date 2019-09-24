'use strict';
import * as Hapi from 'hapi';
const Scooter = require('@hapi/scooter');

// 简单日期插件
const myDatePlugin = {
    name: 'getDate',
    version: '1.0.0',
    register: async function (server, options) {

        const currentDate = function () {
            const date = new Date();
            return date
        }
        server.decorate('toolkit', 'getDate', currentDate);
    }
}

const init = async () => {

    const server = new Hapi.Server({
        port: 3000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Hapi.Request, h) => {
            request.params;
            console.log(`xxx decorate 插件`, h['getDate']())
            return request.plugins['scooter'];
            // return 'Hello World!';
        }
    });

    server.route({
        method: 'GET',
        path: '/test',
        handler: () => {
            return 'i am test';
        }
    });

    server.register({plugin: myDatePlugin})
    await server.register(Scooter);

    // 拦截所有路由
    server.ext({
        type: 'onRequest',
        method: function (request, h) {
            if(request.query['jack']){
                return h.continue;
            }else{
                return h.response("not auth").takeover();
            }
        }
    });
};




process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();