FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /src/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY /src .

EXPOSE 8080

ENV COLOR silver
ENV API_SERVER_IP http://35.200.62.214:8080
ENV NAMESPACE odrly2-2-29-3

CMD [ "node", "monitor" ]
