/**
 * Created by qiankn on 2017/1/13.
 */
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');


var ExtractTextPlugin = require('extract-text-webpack-plugin');
var vueConfig = require('./vue-loader.config');


module.exports = {
    // 入口文件地址，不需要写完，会自动查找
    entry: {
        index: path.resolve(__dirname, '../src/main.js'),
        share: path.resolve(__dirname, '../src/entries/share/main.js'),
        projshare: path.resolve(__dirname, '../src/entries/testChart/main.js'),
        login: path.resolve(__dirname, '../src/login.js'),
        vendors: ['vue', 'vue-router', 'vuex', 'es6-promise']
    },
    // 输出
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
        filename: 'js/[name].[chunkhash:7].js',
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
                exclude: /node_modules/
            },
            {
                test: /\.(webp|png|jpg|jpeg|gif|ico|svg)$/i,
                loader: 'url-loader',
                options: {
                    limit: 1,
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
            favicon: path.resolve(__dirname, '../src/assets/img/favicon.ico'),
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
            favicon: path.resolve(__dirname, '../src/assets/img/favicon.ico'),
            template: './src/template.html',
            filename: 'utest-report-share.html',
            chunks: ['share', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '项目成长分享',
            favicon: path.resolve(__dirname, '../src/assets/img/favicon.ico'),
            template: './src/template.html',
            filename: 'pro-report-share.html',
            chunks: ['projshare', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '登录',
            favicon: path.resolve(__dirname, '../src/assets/img/favicon.ico'),
            template: './src/login.html',
            filename: 'login.html',
            chunks: ['login', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '重置',
            favicon: path.resolve(__dirname, '../src/assets/img/favicon.ico'),
            template: './src/reset.html',
            filename: 'reset.html',
            chunks: ['login', 'vendors'],
            hash: true,
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: '跳转',
            favicon: path.resolve(__dirname, '../src/assets/img/favicon.ico'),
            template: './src/redirect.html',
            filename: 'redirect.html',
            hash: true,
            chunks: ['vendors'],
            inject: 'body'
        }),
        // new CopyWebpackPlugin([{
        //     from: __dirname + '/src/login.html',
        //     to:__dirname+ '/dist'
        // }]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',          //
            filename: 'vendor/vendors.js',
            chunks: ['app', 'vendors'],
            minChunks: Infinity  //最少需要被多少个模块引用才会被抽离
        })
    ],
    resolve: {
        /*alias: {
         //不写此配置的话，vue默认为运行时版本，只支持渲染函数，不能编译浏览器模板
         'vue$': 'vue/dist/vue.common.js'
         },*/
        extensions: ['.js', '.vue']
    },

    devServer: {
    }
    //devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
    //只有生产环境中将css抽离，因为抽离的CSS不能HMR
    vueConfig.loaders = {
        less: ExtractTextPlugin.extract({
            use: 'css-loader!less-loader',
            publicPath: '../',
            fallback: 'vue-style-loader' // <- this is a dep of vue-loader
        }),
        sass: ExtractTextPlugin.extract({
            use: 'css-loader!sass-loader',
            fallback: 'vue-style-loader' // <- this is a dep of vue-loader
        })
    }
    //module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new ExtractTextPlugin('css/[name].[chunkhash:7].css'),
        //清空dist文件夹
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '..')//必须是一个绝对路径，此处用path模块保持通用
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
        //webpack2不再需要此插件
        //https://gist.github.com/sokra/27b24881210b56bbaff7#occurrence-order
        //new webpack.optimize.OccurenceOrderPlugin()
    ])
}
