```bash
Usage
	$ microbundle <command> [options]

Available Commands
	build    Build once and exit
	watch    Rebuilds on any change

For more info, run any command with the `--help` flag
	$ microbundle build --help
	$ microbundle watch --help

Options
	-v, --version      Displays current version
	-i, --entry        Entry module(s)
	-o, --output       Directory to place build files into
	-f, --format       Only build specified formats (any of modern,esm,cjs,umd or iife) (default modern,esm,cjs,umd)
	-w, --watch        Rebuilds on any change  (default false)
	--pkg-main         Outputs files analog to package.json main entries  (default true)
	--target           Specify your target environment (node or web)  (default web)
	--external         Specify external dependencies, or 'none' (default peerDependencies and dependencies in package.json)
	--globals          Specify globals dependencies, or 'none'
	--define           Replace constants with hard-coded values (use @key=exp to replace an expression)
	--alias            Map imports to different modules
	--compress         Compress output using Terser (default true when --target is web, false when --target is node)
	--strict           Enforce undefined global context and add "use strict"
	--name             Specify name exposed in UMD and IIFE builds
	--cwd              Use an alternative working directory  (default .)
	--sourcemap        Generate source map  (default true)
	--raw              Show raw byte size  (default false)
	--jsx              A custom JSX pragma like React.createElement (default h)
	--jsxFragment      A custom JSX fragment pragma like React.Fragment (default Fragment)
	--jsxImportSource  Declares the module specifier to be used for importing jsx factory functions
	--tsconfig         Specify the path to a custom tsconfig.json
	--generateTypes    Whether or not to generate types, if `types` or `typings` is set in `package.json` then it will default to be `true`
	--css              Where to output CSS: "inline" or "external" (default "external")
	--css-modules      Configures .css to be treated as modules (default null)
	--workers          Bundle module workers - see https://github.com/surma/rollup-plugin-off-main-thread#auto-bundling  (default false)
	--visualize        Generate bundle makeup visualization (stats.html)
	-h, --help         Displays this message

Examples
	$ microbundle build --globals react=React,jquery=$
	$ microbundle build --define API_KEY=1234
	$ microbundle build --alias react=preact/compat
	$ microbundle watch --no-sourcemap # don't generate sourcemaps
	$ microbundle build --tsconfig tsconfig.build.json
```
