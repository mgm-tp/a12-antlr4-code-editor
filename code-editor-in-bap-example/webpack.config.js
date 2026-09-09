/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import Fs from "fs";
import Path from "path";

import Webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ReactRefreshBabel from "react-refresh/babel";
import TerserPlugin from "terser-webpack-plugin";

const __dirname = import.meta.dirname;

export default (env = { profile: "prod" }, { mode }) => {
	// Used to determine the needed webpack options for optimization
	const isProduction = ["production", "prod"].includes(process.env.NODE_ENV);

	// Used to determine in which profile the template project should run
	const profile = env.profile || "dev";

	// Create info string for sample application header
	const packageJson = JSON.parse(Fs.readFileSync(Path.join(__dirname, "package.json")));
	const version = packageJson.version + " [" + profile.toUpperCase() + "]";

	// Variable that will be injected into the sample application with Webpack.DefinePlugin
	const globalVariables = {
		__VERSION__: JSON.stringify(version),
		__SHORT_VERSION__: JSON.stringify(packageJson.version),
		SC_DISABLE_SPEEDY: false
	};

	const devServer = {
		hot: true,
		port: 8081,
		static: [
			// Makes resources models available
			Path.join(__dirname, "resources", "html", "models")
		],
		client: {
			overlay: false
		}
	};

	const baseConfig = {
		mode: "none",
		context: Path.join(__dirname),
		module: {
			rules: [
				{
					test: /\.[tj]sx?$/,
					use: [
						{
							loader: "babel-loader",
							options: {
								plugins: [!isProduction && ReactRefreshBabel].filter(Boolean)
							}
						}
					],
					exclude: /node_modules/
				},
				{
					test: /\.js$/,
					enforce: "pre",
					use: ["source-map-loader"]
				},
				{
					test: /\.m?js$/,
					include: /node_modules/,
					resolve: {
						fullySpecified: false
					}
				},
				{
					test: /\.css$/,
					use: [
						"style-loader",
						"css-loader",
						{
							loader: "postcss-loader",
							options: {
								postcssOptions: {
									plugins: ["autoprefixer"]
								}
							}
						}
					]
				},
				{
					test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf)$/i,
					// More information here https://webpack.js.org/guides/asset-modules/
					type: "asset",
					generator: {
						filename: "static/media/[hash][ext][query]"
					}
				}
			]
		},
		watchOptions: {
			ignored: ["**/node_modules", "**/antlrcodeeditor-core/src"]
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					exclude: /sample\.picus\.validation\.js$/
				})
			],
			splitChunks: {
				chunks: "all",
				maxInitialRequests: Infinity,
				minSize: 0,
				cacheGroups: {
					antlr4CodeEditorAddonVendor: {
						name: "antlr4CodeEditorAddonVendor",
						test: /[\\/]antlrcodeeditor-core[\\/]/,
						priority: 1
					},
					vendor: {
						name: "vendor",
						test: /[\\/]node_modules[\\/]/,
						priority: 0
					}
				}
			}
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin({
				typescript: {
					configFile: Path.resolve(__dirname, "./src/tsconfig.json")
				}
			}),
			...(isProduction ? [] : [new ReactRefreshPlugin()]),
			new CopyPlugin({
				patterns: [
					// Makes resources (index.html, logo) available
					{
						from: Path.join(__dirname, "resources", "html"),
						filter: async resourcePath => {
							if (resourcePath.endsWith("index.html")) {
								return false;
							}
							return true;
						}
					},
					Path.join(__dirname, "resources", "html", "models"),
					// Makes monaco available
					Path.resolve("..", "node_modules", "monaco-editor", "min")
				]
			}),
			new HtmlWebpackPlugin({
				template: Path.resolve(__dirname, "./resources/html/index.html")
			})
		],
		resolve: {
			fallback: {
				/**
				 * Workaround to fix a bug in webpack related to fs in the web target.
				 */
				fs: false
			},
			extensions: [".tsx", ".ts", ".js"],
			extensionAlias: {
				".js": [".ts", ".tsx", ".js"]
			}
		}
	};

	const prodBaseConfig = Object.assign({}, baseConfig, {
		mode: "production",
		plugins: [
			...baseConfig.plugins,
			new Webpack.DefinePlugin(
				Object.assign({}, globalVariables, {
					PRODUCTION: JSON.stringify(true),
					"process.env.NODE_ENV": JSON.stringify("production")
				})
			)
		]
	});

	const devBaseConfig = Object.assign({}, baseConfig, {
		devtool: "eval-source-map",
		mode: "development",
		plugins: [...baseConfig.plugins, new Webpack.DefinePlugin(globalVariables)]
	});

	const bundleConfig = isProduction ? prodBaseConfig : devBaseConfig;
	return [
		Object.assign({}, baseConfig, {
			...bundleConfig,
			entry: [
				// Bundle application
				Path.join(__dirname, "src", "index.tsx")
			],
			devServer,
			output: {
				hashFunction: "sha256",
				path: Path.join(__dirname, "dist"),
				filename: "[name].js"
			}
		})
	];
};
