# MapleImage Base

## use docker as development environment

```bash
# 构建Docker镜像
docker build -t liutsing/base:1.0.0 .

# 运行Docker容器，将本地代码目录挂载到容器中
docker run -v ./:/app --name liutsing-base-instance liutsing/base:1.0.0
```

## References

- [@odp/pnagu](https://github.com/open-data-plan/pangu)

## .npmrc

```sh
auto-install-peers=true
strict-peer-dependencies=true
registry=https://registry.npmjs.com
# registry=https://registry.npmmirror.com
git-checks=false
enable-pre-post-scripts=true
strict-peer-dependencies=false

```
