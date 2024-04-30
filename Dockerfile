# Use Node.js base image
FROM node:18

# Create and set working directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install npm packages
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 5000

# Define the command to run your app
CMD [ "node", "index.js" ]
