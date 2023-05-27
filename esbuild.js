#!/usr/bin/env node

require("dotenv").config();

const { definePlugin } = require("esbuild-plugin-define");
const watchFlag = process.argv.indexOf("--watch") > -1;
const minifyFlag = process.argv.indexOf("--minify") > -1;

require("esbuild")
	.build({
		entryPoints: ["src/ts/main.ts", "src/ts/textAdventure/textAdventure.ts"],
		bundle: true,
		outdir: "dist",
		watch: watchFlag,
		minify: minifyFlag,
		sourcemap: !minifyFlag ? "both" : false,
		target: "es2020",
		plugins: [
			definePlugin({
				process: {
					env: {
						INSIGHTS_KEY: process.env.INSIGHTS_KEY,
					},
				},
			}),
		],
	})
	.catch(() => process.exit(1));
