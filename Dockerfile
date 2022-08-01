FROM node:18-bullseye

RUN apt update && apt upgrade -y

RUN useradd -m -d /opt/app appuser

COPY lib /opt/app/lib/
COPY middleware /opt/app/middleware/
ADD index.js /opt/app
ADD security.js /opt/app
ADD package.json /opt/app
ADD package-lock.json /opt/app

RUN chown -R appuser /opt/app

USER appuser
WORKDIR /opt/app
RUN npm install
EXPOSE 5000
CMD ["index.js"]