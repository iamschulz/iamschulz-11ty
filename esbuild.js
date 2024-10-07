#!/usr/bin/env node

import * as dotenv from "dotenv";
import { definePlugin } from "esbuild-plugin-define";
import { build } from "esbuild";

dotenv.config({ path: "./config" });

const watchFlag = process.argv.indexOf("--watch") > -1;
const minifyFlag = process.argv.indexOf("--minify") > -1;

build({
	entryPoints: ["src/ts/main.ts", "src/ts/textAdventure/textAdventure.ts"],
	bundle: true,
	outdir: "dist",
	//watch: watchFlag, // todo: add watch flag
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
}).catch(() => process.exit(1));
