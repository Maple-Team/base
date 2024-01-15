# 建立一个新的镜像文件，配置模板：新建立的镜像是以adoptopenjdk/openjdk11:jre-nightly为基础模板
# FROM nginx:stable
FROM nginx:1.25.3

# 维护者
MAINTAINER author <shi.gangyuan@ecar.com>

# 设置时区
RUN rm -f /etc/localtime && ln -sv /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

# 创建工作区,自行更改目录
RUN mkdir -p /app

WORKDIR /app

# 复制文件到容器内
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./build /app/

# VOLUME 指定了临时文件目录为/tmp 其效果是在主机 /var/lib/docker 目录下创建了一个临时文件，并链接到容器的/tmp
VOLUME /tmp

#容器内暴露端口
EXPOSE 80

# 定义容器启动执行的命令，注意：在docker run使用这个镜像，镜像后禁止追加命令，否则会导致CMD指令不生效.
#CMD ps -ef|grep nginx
