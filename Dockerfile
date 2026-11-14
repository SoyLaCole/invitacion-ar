FROM nginx:1.27-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY index.html momento2.mind momento4.html momento5.html momento6.html momento3.html momento3.mind momento2.html momento2v2.mind momento4v2.mind momento4.mind momento4.mp4 qrscan.js m2_*.webp m3_*.webp m4_*.webp /usr/share/nginx/html/
EXPOSE 80
