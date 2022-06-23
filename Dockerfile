FROM node:16.13.1

ENV PORT=3090
WORKDIR /usr/src/app
RUN apt update
RUN npm i -g pnpm

COPY . /usr/src/app
RUN pnpm i
RUN pnpm build
EXPOSE 3090
ENTRYPOINT [ "npm" ]
CMD [ "run" ,"start"]
