# 1. Use Node.js as base (node:18 = official default; use if node:18-bullseye fails to pull)
FROM node:18

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the app code
COPY . .

# 6. Expose port 3000
EXPOSE 3000

# 7. Start the app
CMD ["node", "app.js"]



# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["node", "app.js"]
