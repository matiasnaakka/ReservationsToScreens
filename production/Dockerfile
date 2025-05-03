# Use official Node.js LTS image matching the engines field in package.json
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Install wget for healthcheck
RUN apk --no-cache add wget

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port(s) your app uses (adjust if needed)
EXPOSE 3000

# Set environment to production by default
ENV NODE_ENV=production

# Add simple healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the app with PM2 using the ecosystem config
CMD ["pm2-runtime", "ecosystem.config.js"]
