FROM nginx:1.25.2
# 设置时区
RUN rm -f /etc/localtime && ln -sv /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

RUN mkdir -p /app2

WORKDIR /app2

# 复制文件到容器内
COPY ./app2.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx
COPY ./dist2 /app2

EXPOSE 80

