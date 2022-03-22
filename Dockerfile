FROM node:16.13.1

ENV PORT=80
WORKDIR /usr/src/app
RUN apt update
RUN apt -y install ffmpeg
RUN npm i -g pnpm

COPY . /usr/src/app
RUN pnpm i
RUN pnpm build
EXPOSE 3000
ENTRYPOINT [ "npm" ]
CMD [ "run" ,"start"]
