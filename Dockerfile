FROM node:20
WORKDIR /app
COPY app/ /app/app
COPY public/ /app/public
COPY package.json .
COPY .env .
COPY tsconfig.json .
COPY vite* /app/
# RUN npm install -g yarn
RUN rm -rf node_modules
RUN yarn
RUN npx vite build --mode client
RUN npx vite build
EXPOSE $PORT
CMD ["node", "dist/server.mjs"]
