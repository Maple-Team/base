FROM nginx:1.25.2
# 设置时区
RUN rm -f /etc/localtime && ln -sv /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

ENV TZ=Asia/Shanghai

RUN mkdir -p /app

WORKDIR /app

# 复制文件到容器内
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/proxy_settings.conf /etc/nginx/proxy_settings.conf
COPY ./docker/nginx.conf /etc/nginx/nginx
COPY ./dist /app/

EXPOSE 80

