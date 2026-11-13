FROM nginx:1.27-alpine
COPY index.html momento2.mind momento4.html momento4.mind momento4.mp4 /usr/share/nginx/html/
EXPOSE 80
