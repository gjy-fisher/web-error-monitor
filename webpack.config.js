const webpack = require('webpack')
const path = require('path')

const version = require('./package.json').version

const config = {
    devtool: 'cheap-source-map',
    
    entry: {
        main: './src/index'
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'report_' + version + '_[hash:8].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            // 需要在LoaderOptionsPlugin中匹配minize
            sourceMap: false,
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告  
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true
            }
        })
    ]

}

module.exports = config
