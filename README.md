# Weather API with Redis Caching and Rate-Limiting

This project is a weather API that fetches real-time weather data from a third-party weather service (Visual Crossing) and caches it using Redis to optimize performance and reduce the number of API calls. The API is built using **Node.js**, **Express**, and **TypeScript** with **Redis** integrated via Docker for caching.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Redis Caching](#redis-caching)
- [Error Handling](#error-handling)
- [Challenges Faced](#challenges-faced)

## Project Overview

The purpose of this project is to:
- Build a weather API that fetches data from a third-party API (Visual Crossing).
- Implement in-memory caching using **Redis** to store weather data and reduce redundant API calls.
- Use Docker for Redis containerization and easy environment setup.
- Also implemente rate-limiting feature for smooth api usage

### Why Caching?

Third-party APIs often come with rate limits, and making frequent requests can result in blocked access. To avoid excessive API calls and reduce response time, we cache weather data for a specified time (e.g., 1 hour) using Redis. If the requested data is already cached, it will be served from the cache, improving the API's efficiency.
![Caching concept](https://assets.roadmap.sh/guest/weather-api-f8i1q.png)

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **TypeScript**: Strongly typed superset of JavaScript.
- **Redis**: In-memory key-value store for caching.
- **Docker**: For running Redis in a containerized environment.

## Setup and Installation

### Prerequisites

- **Node.js** installed (v14.x or above).
- **Docker** installed for running Redis.
- Visual Crossing API key for fetching weather data.

### Steps to Run the Project

##### Clone the Repository

   ```bash
   git clone https://github.com/your-username/weather-api.git
   cd weather-api
   ```
##### Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```
##### Set Up Environment Variables

Create a .env file in the root directory with the following values:

```bash
WEATHER_API_KEY=your-visual-crossing-api-key
REDIS_URL=redis://localhost:6379
```
##### Set Up Redis with Docker

Start a Redis container using Docker:

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker exec -it <continer name> bash
redis-cli
```

##### Once everything is set up, you can start the server:

```bash
npx ts-node src/app.ts
```
The server will be running at http://localhost:8080

##### API Endpoints
GET api/weather/<city name>
Fetches the current weather data for the specified city. For example:

```bash
http://localhost:3000/weather/London
```
### Redis Caching
The weather data fetched from Visual Crossing is cached in Redis to improve performance and reduce the number of requests made to the external API. Redis stores the data for 1 hour, after which the cache expires, and fresh data is fetched from the API.

#### Redis Cache Flow:
- Check Cache: When a request is made, the app first checks if the data for that city is already in the cache.
- Serve from Cache: If cached data exists, it’s returned to the user.
- Fetch Fresh Data: If no cached data is found, a request is made to the external API, and the fresh data is cached for future use.

### Error Handling
- Invalid City Name: If the city name is invalid or misspelled, the API returns an appropriate error message.
- API Failure: If the external API fails (e.g., rate limits, downtime), an internal server error (500) is returned with a message.
- Redis Failure: If Redis is down or not reachable, the app continues to fetch data from the external API and logs the error.

### Challenges Faced
##### 1. Redis Integration:
Initially, I faced challenges with integrating Redis, as there were issues with connection and handling caching in an efficient manner. Switching to ioredis solved some of the problems, providing a more robust API for Redis integration.

##### 2. TypeScript Types:
TypeScript helped catch a lot of bugs early, but managing complex types, especially with third-party libraries (like axios and ioredis), was tricky. The key was to define the expected response types for better type safety.

##### 3. Handling ERR_HTTP_HEADERS_SENT Error:
During the implementation, I encountered the infamous "Cannot set headers after they are sent to the client" error. This was caused by multiple responses being sent due to missing return statements after sending cached or fresh data. I resolved this by ensuring that a response is sent only once in all cases using proper control flow.

##### 4. API Rate Limits:
To avoid hitting the rate limits of the weather API, I implemented caching with Redis to store the weather data for a specified period, reducing the number of redundant requests to the external API.

[View the project on roadmap.sh](https://roadmap.sh/projects/weather-api-wrapper-service)

## Docker and Redis Setup Guide

### Option 1: Quick Setup (Recommended)

If you want to get started quickly with Docker and Redis:

#### 1. Install Docker Desktop

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download "Docker Desktop for Windows" (or your OS)
   - Run the installer and follow setup wizard
   - **Restart your computer** when prompted

2. **Verify Docker Installation:**
   ```bash
   docker --version
   ```

#### 2. Start Redis Container

```bash
# Pull and run Redis container
docker run -d --name redis-weather -p 6379:6379 redis:alpine

# Verify Redis is running
docker ps
```

#### 3. Update Environment Variables

Make sure your `.env` file contains:
```bash
WEATHER_API_KEY=your-visual-crossing-api-key
REDIS_URL=redis://localhost:6379
PORT=3000
```

#### 4. Start the Application

```bash
npm run dev
```

You should see:
```
✅ Connected to Redis - caching enabled
port is running in port 3000
```

### Option 2: Detailed Docker Setup

#### Installing Docker on Different Operating Systems

##### Windows:
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Run the installer (requires Windows 10/11 Pro, Enterprise, or Education)
3. Enable WSL 2 when prompted
4. Restart your computer
5. Launch Docker Desktop and wait for it to start

##### macOS:
```bash
# Using Homebrew
brew install --cask docker

# Or download from Docker website
# https://www.docker.com/products/docker-desktop/
```

##### Linux (Ubuntu/Debian):
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional)
sudo usermod -aG docker $USER
```

#### Redis Container Management

##### Start Redis Container:
```bash
docker run -d --name redis-weather -p 6379:6379 redis:alpine
```

##### Stop Redis Container:
```bash
docker stop redis-weather
```

##### Start Existing Container:
```bash
docker start redis-weather
```

##### Remove Container:
```bash
docker rm redis-weather
```

##### View Container Logs:
```bash
docker logs redis-weather
```

##### Access Redis CLI:
```bash
docker exec -it redis-weather redis-cli
```

### Option 3: Redis Without Docker

If you prefer to install Redis directly:

#### Windows:
1. Download Redis from: https://github.com/microsoftarchive/redis/releases
2. Extract and run `redis-server.exe`
3. Redis will run on `localhost:6379`

#### macOS:
```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
```

### Testing Redis Connection

#### Test Redis is Working:
```bash
# Using Docker
docker exec -it redis-weather redis-cli ping

# Should return: PONG
```

#### Test API with Caching:
1. **First request** (slow - fetches from API):
   ```
   GET http://localhost:3000/api/weather/london
   ```

2. **Second request** (fast - served from cache):
   ```
   GET http://localhost:3000/api/weather/london
   ```

### Troubleshooting

#### Docker Issues:
- **"Docker not found"**: Make sure Docker Desktop is installed and running
- **"Port already in use"**: Stop existing Redis containers with `docker stop redis-weather`
- **WSL errors on Windows**: Update WSL with `wsl --update`

#### Redis Connection Issues:
- **"Redis connection failed"**: Check if Redis container is running with `docker ps`
- **"ECONNREFUSED"**: Verify Redis is running on port 6379
- **Environment variables**: Ensure `REDIS_URL=redis://localhost:6379` in `.env`

#### API Issues:
- **"Invalid API key"**: Get a free key from https://www.visualcrossing.com/weather-api
- **"Error fetching weather data"**: Check your internet connection and API key

### Performance Benefits

With Redis caching enabled:
- **First request**: ~500-1000ms (API call)
- **Cached requests**: ~10-50ms (Redis lookup)
- **Cache duration**: 6000 seconds (100 minutes)
- **Rate limiting**: 50 requests per hour per IP

### Production Deployment

For production environments, consider:

1. **Redis Cloud Services:**
   - Redis Cloud: https://redis.com/try-free/
   - AWS ElastiCache
   - Google Cloud Memorystore
   - Azure Cache for Redis

2. **Environment Variables:**
   ```bash
   REDIS_URL=redis://your-production-redis-url:port
   WEATHER_API_KEY=your-production-api-key
   PORT=3000
   ```

3. **Docker Compose** (optional):
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       depends_on:
         - redis
       environment:
         - REDIS_URL=redis://redis:6379
     redis:
       image: redis:alpine
       ports:
         - "6379:6379"
   ```

### Quick Commands Reference

```bash
# Docker commands
docker run -d --name redis-weather -p 6379:6379 redis:alpine
docker ps
docker stop redis-weather
docker start redis-weather
docker logs redis-weather

# Application commands
npm install
npm run dev
npm run build
npm start

# Testing
curl http://localhost:3000/api/weather/london
curl http://localhost:3000/
```

---

**🎉 Your Weather API with Redis caching is now ready for development and production!**