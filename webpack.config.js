const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "assets", "js")
    },
    watch: true,
    mode: "development",
    devtool: "source-map",
    resolve: {
        extensions: [".webpack.js", ".web.ts", ".ts", ".tsx", ".js", ".css"]
    },
    module: {
        // rules: [
        //     { 
        //         test: /\.m?js$/,
        //         use: {
        //             loader: 'babel-loader',
        //             options: {
        //                 presets: ['@babel/preset-env'],
        //                 plugins: ['@babel/plugin-proposal-class-properties']
        //             }
        //         }
        //     }
        // ]
        rules: [
            {
                test: /\.tsx?$/, loader: "ts-loader"
            },
            {
                test: /\.js$/, loader: "source-map-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}