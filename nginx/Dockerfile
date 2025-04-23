FROM nginx:nginx:1.26.3-alpine

RUN mkdir /wwwroot
COPY ./default.conf /etc/nginx/nginx.conf

RUN service nginx start
