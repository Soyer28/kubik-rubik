const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoPreFixer = require('autoprefixer');

const __root = path.resolve(__dirname, 'dist');

module.exports = (env, options) => {

    let conf = {
        entry: {index: ['@babel/polyfill', './src/index.js']},
        devtool: "source-map",
        devServer: {
            contentBase: path.resolve(__dirname, 'build'),
            historyApiFallback: true,
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-syntax-dynamic-import']
                        }
                    },
                },
                {
                    test: /\.(glsl|frag|vert)$/,
                    use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
                },
                {
                    test: /three\/examples\/js/,
                    use: 'imports-loader?THREE=three'
                },
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 2,
                                modules: {
                                    localIdentName: '[name]__[local]--[hash:base64:5]',
                                }
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    AutoPreFixer({
                                        browsers: ['ie >= 8', 'last 4 version']
                                    })
                                ],
                                sourceMap: false,
                                config: { path: './postcss.config.js'},
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: options.mode !== 'production' }
                        }
                    ],
                },
                {
                    test: /\.ico$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    },
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    loader: 'file-loader',
                    options: {
                        name(file) {
                            if (options.mode === 'development') {
                                return '[path][name].[ext]';
                            }

                            return '[contenthash].[ext]';
                        },
                        publicPath: '/img',
                        outputPath: 'img'
                    },
                },
                {
                    test: /\.(woff|woff2|ttf|eot)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[hash:8].[ext]',
                                outputPath: 'fonts/'
                            }
                        }
                    ]

                },
            ]
        },
        resolve: {
            alias: {
                'three-examples': path.join(__root, './node_modules/three/examples/js'),
            }
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: '[hash:8].css'
            }),
            // new webpack.ProvidePlugin({
            //     'THREE': 'three'
            // })
            // new CopyWebpackPlugin([
            //     {
            //         from: "./src/assets/favicon",
            //         to: "./favicon"
            //     }
            // ]),
        ],

    };

    return conf;

};