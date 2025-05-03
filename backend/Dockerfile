FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Rebuild bcrypt for the container architecture
RUN npm rebuild bcrypt --build-from-source

COPY . .

# Sinh client Prisma
RUN npx prisma generate

RUN npm run build

# Make script executable
RUN chmod +x ./scripts/start.sh

EXPOSE 3000

CMD ["./scripts/start.sh"] 