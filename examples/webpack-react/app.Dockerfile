FROM nginx:1.25
# 设置时区
RUN rm -f /etc/localtime && ln -sv /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

RUN mkdir -p /app

WORKDIR /app

# 复制文件到容器内
COPY ./app.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx
COPY ./dist /app/

EXPOSE 80

