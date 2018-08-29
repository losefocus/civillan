FROM nginx
VOLUME /tmp
ENV LANG en_US.UTF-8
ADD dist/ /usr/share/nginx/html/
EXPOSE 9991
EXPOSE 443
