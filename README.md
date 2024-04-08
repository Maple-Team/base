# MapleImage Base





## use docker as development environment

```bash
# 构建Docker镜像
docker build -t liutsing/base:1.0.0 .

# 运行Docker容器，将本地代码目录挂载到容器中
docker run -v ./:/app --name liutsing-base-instance liutsing/base:1.0.0
```