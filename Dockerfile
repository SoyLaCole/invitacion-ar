FROM nginx:1.27-alpine
COPY index.html /usr/share/nginx/html/index.html
COPY momento2.mind /usr/share/nginx/html/momento2.mind
EXPOSE 80
