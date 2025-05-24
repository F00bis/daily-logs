# Development stage
FROM node:21-alpine AS development
WORKDIR /app

# Install development dependencies and setup for both client and server
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install all dependencies including devDependencies for development
WORKDIR /app/server
RUN npm install

WORKDIR /app/client
RUN npm install

# Copy source code for development
COPY client/ ./client/
COPY server/ ./server/

# Production build stage for client
FROM node:21-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
# Install only the dependencies needed for building
RUN npm install --only=production && \
    npm install --no-save @vitejs/plugin-react-swc typescript
COPY client/ .
RUN npm run build

# Production build stage for server
FROM node:21-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
# Install only the dependencies needed for building
RUN npm install --only=production && \
    npm install --no-save typescript @types/node
COPY server/ .
RUN npm run build

# Production stage
FROM node:21-alpine AS production
WORKDIR /app

# Copy server files and set it up
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/
WORKDIR /app/server
RUN npm install --only=production

# Copy client files
WORKDIR /app
COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=client-builder /app/client/package*.json ./client/
WORKDIR /app/client
RUN npm install --only=production

# Install a lightweight web server for serving the client
RUN npm install -g serve

# Create a startup script
WORKDIR /app
RUN echo "#!/bin/sh" > start.sh && \
    echo "cd /app/server && npm start &" >> start.sh && \
    echo "cd /app/client && serve -s dist -l 5173" >> start.sh && \
    chmod +x start.sh

# Expose the client port
EXPOSE 5173

# Start both services with client as the main entry point
CMD ["sh", "/app/start.sh"] 