// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var vueConfig = require('./vue-loader.config');

module.exports = {
    // 入口文件地址，不需要写完，会自动查找
    entry: {
        libs: [
            //path.resolve(__dirname, '../src/assets/libs/jquery-2.1.4.min.js'),
            path.resolve(__dirname, '../src/assets/libs/vue.js')
        ],
        index: path.resolve(__dirname, '../src/main.js'),
        share: path.resolve(__dirname, '../src/entries/share/main.js'),
        projshare: path.resolve(__dirname, '../src/entries/testChart/main.js'),
        tvExhib: path.resolve(__dirname, '../src/entries/tv-report/main.js'),
        login: path.resolve(__dirname, '../src/login.js'),
        config: path.resolve(__dirname, '../src/config.js'),
        vendors: ['vue', 'vue-router', 'vuex', 'es6-promise']
    },
    // 输出
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
        filename: 'js/[name].[hash:5].js'
    },
    // 加载器
    module: {
        rules: [
            // 解析.vue文件
            {
                test: /\.vue$/i,
                loader: 'vue-loader',
                options: vueConfig
            },
            // 转化ES6的语法
            {
                test: /\.js$/i,
                loader: 'babel-loader',
                exclude: [/node_modules/, /config/]
            },
            {
                test: /\.(webp|png|jpg|jpeg|gif|ico|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: './assets/[name].[hash:5].[ext]'
                }
            },
            {
                test: /\.json$/i,
                loader: 'json-loader'
            },
            {
                test: /\.css$/i,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/i,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/i,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/i,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/i,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/i,
                loader: "file-loader"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/i,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.(webm|mp4)$/i,
                loader: 'file-loader',
                options: {
                    name: 'static/[name].[hash:5].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Xtest系统',
            template: './src/template.html',
            filename: 'index.html',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            chunks: ['index', 'vendors'],
            hash: true,
            //要把script插入到标签里
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '分享',
            template: './src/template.html',
            filename: 'utest-report-share.html',
            chunks: ['share', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '项目成长分享',
            template: './src/template.html',
            filename: 'pro-report-share.html',
            chunks: ['projshare', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '大电视展示',
            template: './src/template.html',
            filename: 'TV-Exhibition.html',
            chunks: ['tvExhib', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '登录',
            template: './src/login.html',
            filename: 'login.html',
            hash: true,
            chunks: ['login', 'config', 'libs', 'vendors'],
            inject: 'body',
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true, //删除空白符与换行符
                // 为了使GAEA能正确识别script, 保留引号
                // removeAttributeQuotes: true,
                minifyJS: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        new HtmlWebpackPlugin({
            title: '重置',
            template: './src/reset.html',
            filename: 'reset.html',
            chunks: ['login', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '跳转',
            template: './src/redirect.html',
            filename: 'redirect.html',
            hash: true,
            chunks: ['vendors'],
            inject: 'body'
        })
        // new CopyWebpackPlugin([{
        //     from: __dirname + '/src/login.html',
        //     to:__dirname+ '/dist'
        // }]),
    ],
    resolve: {
        /*alias: {
         //不写此配置的话，vue默认为运行时版本，只支持渲染函数，不能编译浏览器模板
         'vue$': 'vue/dist/vue.common.js'
         },*/
        extensions: ['.js', '.vue']
    },

    devServer: {
        proxy: {
            /*"*!/static": {
             target: "http://localhost:8080",
             },*/
            /*'**': {
                target: 'http://localhost:8899',
                pathRewrite: (function () {
                    var res = {};
                    glob.sync('src/pages/!**!/!*.html').forEach(function (entry) {
                        var name = '/' + path.basename(entry, '.html');
                        res[name] = name + '.html';
                    });
                    return res;
                })(),
                bypass: function (req) {
                    if (req.headers.accept.indexOf("static") !== -1) {
                        console.log("Skipping proxy for browser request.");
                        return false;
                    }
                }
            }*/
        },
        disableHostCheck: true,
        noInfo: true,
        compress: true
    },
    devtool: '#source-map'

};

