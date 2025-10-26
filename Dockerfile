# Base image with Python and Node support
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip gcc g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy all project files (node_modules will be ignored by .dockerignore)
COPY . .

# Install Python dependencies from uagent-client with retry
RUN pip3 install --no-cache-dir --break-system-packages --default-timeout=100 --retries 5 uagents uagents-core requests

# Expose Next.js port
EXPOSE 3000

# Start both the bridge agent and Next.js application
CMD ["sh", "-c", "python3 node_modules/uagent-client/bridge_agent.py & npm run dev"]
