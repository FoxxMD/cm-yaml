# CM Yaml Editor

Based on [monaco-yaml](https://github.com/remcohaszing/monaco-yaml)

# Install

```
git clone https://github.com/foxxmd/cm-yaml
cd cm-yaml
npm ci
npm run prepack
cd examples/demo
npm --workspace demo start
```

# Usage in [ContextMod](http://github.com/foxxmd/context-mod)

* Uncomment the `publicPath` in `examples/demo/webpack.config.js
* Run `npm --workspace demo build`
* Copy all files from `examples/demo/dist` to `src/Web/assets/public/yaml` in your context-mod repo

