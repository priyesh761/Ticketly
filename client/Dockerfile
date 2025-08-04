FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Use custom CMD that runs env check first
CMD ["sh", "-c", "node check-env.js && npm run dev"]