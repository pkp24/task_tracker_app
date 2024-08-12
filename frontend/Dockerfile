# Use an official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of the application files
COPY . .

# Set environment variable to change port
ENV PORT 1533

# Expose the frontend port
EXPOSE 1533

# Start the application
CMD ["npm", "start"]
