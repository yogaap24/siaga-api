# Use Node.js 18 as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /var/www

# Copy package.json and package-lock.json to the working directory
Copy . .
COPY package.json ./

# Install dependencies
RUN npm install
RUN npm install --save-dev nodemon
RUN npm install @prisma/client

# Expose the port your app will run on
EXPOSE 3000

# Command to run your application
ENV HOST=0.0.0.0
CMD ["npx", , "run", "dev", "--host", "0.0.0.0", "--port", "3000"]
