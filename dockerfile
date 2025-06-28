FROM node:18 

WORKDIR /app

COPY package.json package-lock.json ./

COPY . . 

RUN npm install 

# Epose port 8050
EXPOSE 8050

CMD ["node", "app.js"]

