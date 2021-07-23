FROM node:15-alpine AS build

WORKDIR /app

COPY . /app
RUN npm install

COPY . .
RUN npm run build

FROM node:15-alpine

WORKDIR /app
COPY --from=build /app .
COPY . .

EXPOSE 3000

CMD ["npm", "run", "serve"]
#CMD ["node", "./build"]
