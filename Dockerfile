FROM node:latest

WORKDIR /app

ARG VITE_MAP_BOX_API_KEY
ENV VITE_MAP_BOX_API_KEY=${VITE_MAP_BOX_API_KEY}

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
