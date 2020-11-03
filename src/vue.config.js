module.exports = {
    //devServer.proxy适用于本地开发使用，
    //生成环境请用第三方代理软件，如nginx。
    devServer: {
        port: 8080, //本机端口号
        host: "localhost", //本机主机名
        https: true, //协议
        open: false, //启动服务器时自动打开浏览器访问
        proxy: {
            // '/API': {
            //     //目标服务器,代理访问到http://localhost:8888
            //     target: "https://d18c4217.cn/API",
            //     changOrigin: true, //开启代理
            //     pathRewrite: {
            //         '^/API': ''
            //     }
            }
        }
    }
}
