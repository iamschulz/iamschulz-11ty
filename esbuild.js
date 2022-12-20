#!/usr/bin/env node

const watchFlag = process.argv.indexOf('--watch') > -1;
const minifyFlag = process.argv.indexOf('--minify') > -1;

console.log('foo', process.env.INCOMING_HOOK_BODY);

require('esbuild')
	.build({
		entryPoints: ['src/ts/main.ts', 'src/ts/textAdventure/textAdventure.ts'],
		bundle: true,
		outdir: 'dist',
		watch: watchFlag,
		minify: minifyFlag,
		sourcemap: !minifyFlag ? 'both' : false,
		target: 'es2020',
	})
	.catch(() => process.exit(1));
