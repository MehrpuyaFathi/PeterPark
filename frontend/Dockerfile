FROM node
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./public ./public
COPY ./src ./src
COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json
RUN npm install --silent --force
CMD ["npm", "start"]