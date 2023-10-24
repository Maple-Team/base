# @liutsing/babel-plugin-extract-used-chinese

使用正则表达式`/\p{Script=Han}/u`收集项目中使用到的汉字，写入到临时目录`path.resolve(os.tmpdir(), filename)`中

## usge

in babel config file like `.babelrc`,

```json
{
  "plugins": [
    [
      "@liutsing/babel-plugin-extract-used-chinese",
      {
        "filename": "<收集到的汉字存储文件名>"
      }
    ]
  ]
}
```
