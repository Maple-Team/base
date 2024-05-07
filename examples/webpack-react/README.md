# Webpack React Example

## TODO

- [ ] 完善打包配置项

---

父组件重新渲染

子组件 callback props/memo 包裹

## FAQ

### chunk load error

复现方法:

- 先访问最新的页面，留下需要改动的路由不访问，原页面保持不动
- 改动文件，触发 content-hash 变动
- 重新构建部署
- 上述的页面访问改动的路由，即可复现

## TODO

- [ ] 打包代码代码拆分几块的功能
- [x] 添加 i18n 使用示例
- 拆分，当前项目改为打包/i18n demo 项目
  - [ ] 拆分出 dll demo 项目
  - [ ] 拆分出 modulee federation demo 项目
