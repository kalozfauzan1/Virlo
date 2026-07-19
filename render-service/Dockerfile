FROM node:18-bookworm-slim

ARG APP_UID=10001
ARG APP_GID=10001

# Install Chromium and FFmpeg for Remotion rendering
RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium ffmpeg && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV REMOTION_BUNDLE_PATH=/app/remotion
ENV OUTPUT_DIR=/output

WORKDIR /app

RUN groupadd -g ${APP_GID} appuser && useradd -u ${APP_UID} -g appuser -d /app -s /usr/sbin/nologin appuser

# Copy render service source
COPY render-service/package.json ./
RUN npm install

COPY render-service/tsconfig.json ./
COPY render-service/src/ ./src/

# Copy remotion source for bundling
COPY remotion/package.json /app/remotion/package.json
COPY remotion/tsconfig.json /app/remotion/tsconfig.json
COPY remotion/src/ /app/remotion/src/
COPY remotion/public/ /app/remotion/public/

# Install remotion deps
RUN cd /app/remotion && npm install

# Build TypeScript
RUN npm run build

RUN mkdir -p /output && chown -R appuser:appuser /app /output

USER appuser

EXPOSE 3100
CMD ["node", "dist/server.js"]
