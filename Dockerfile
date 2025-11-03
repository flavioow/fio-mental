# Etapa 1: base com Node (usa Debian que é seguro)
FROM node:23 AS base

# Etapa 2: define diretório de trabalho
WORKDIR /app

# Etapa 3: copia arquivos de dependências
COPY package*.json ./

# Etapa 4: instala dependências (pode usar npm, mas pnpm/yarn tbm serve)
RUN npm install --legacy-peer-deps

# Etapa 5: copia tudo pro container
COPY . .

# Etapa 6: gera o Prisma Client
RUN npx prisma generate

# Etapa 7: build do Next.js (opcional se quiser rodar direto em dev)
RUN npm run build

# Etapa 8: expõe a porta do servidor
EXPOSE 3000

# Etapa 9: comando pra rodar o app
CMD ["npm", "run", "start"]
