FROM node:18-alpine

#Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

#install app dependencies
COPY package.json /usr/src/app
RUN npm install

#Wnvinorment variables
ENV DATABASE="mongodb+srv://bkmonish17:vD3n5QxraiLbz2Q5@cluster0.oxzn9ui.mongodb.net/?retryWrites=true&w=majority"
ENV PORT=5000
ENV SECRET_KEY="XSQ0QRgv6l8JvO2NbYJ5EhJLUvNGQxPb"
ENV HASHINGROUND=13

#Bundle app source
COPY . /usr/src/app
EXPOSE 3000-3010

CMD ["npm", "start"]