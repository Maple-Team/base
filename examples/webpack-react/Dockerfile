FROM nginx:1.25.2
# 设置时区
RUN rm -f /etc/localtime && ln -sv /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

RUN mkdir -p /app

WORKDIR /app

# 复制文件到容器内
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./proxy_settings.conf /etc/nginx/proxy_settings.conf
COPY ./nginx.conf /etc/nginx/nginx
COPY ./index.html /app/

EXPOSE 80

