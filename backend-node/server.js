const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { createClient } = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for demo
    methods: ["GET", "POST"]
  }
});

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || 6379;

console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

const subscriber = createClient({
  url: `redis://${redisHost}:${redisPort}`
});

subscriber.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await subscriber.connect();
    
    await subscriber.subscribe('updates', (message) => {
        console.log("Redis received:", message);
        try {
            const data = JSON.parse(message);
            io.emit('update_event', data);
        } catch (e) {
            console.error("Error parsing message", e);
            io.emit('update_event', { type: 'raw', message: message });
        }
    });

    console.log("Subscribed to 'updates' channel");
})();

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
