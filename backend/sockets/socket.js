const { Server } = require("socket.io");

class SocketService {
  constructor() {
    this.io = null;
    this.onlineUsers = {}; // Store userId -> socketId mapping
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // Allow all origins, change as needed
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`New client connected: ${socket.id}`);

      // Listen for "user_connected" event with userId
      socket.on("user_connected", (userId) => {
        this.onlineUsers[userId] = socket.id;
        console.log(`User ${userId} is online with socket ID: ${socket.id}`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        const userId = this.getUserIdBySocketId(socket.id);
        if (userId) {
          delete this.onlineUsers[userId];
          console.log(`User ${userId} disconnected`);
        }
      });
    });
  }

  // Get userId by socketId (helper method)
  getUserIdBySocketId(socketId) {
    return Object.keys(this.onlineUsers).find(
      (userId) => this.onlineUsers[userId] === socketId
    );
  }

  // Get all online users
  getOnlineUsers() {
    return Object.keys(this.onlineUsers);
  }

  // Emit event to a specific user
  emitToUser(userId, event, data) {
    const socketId = this.onlineUsers[userId];
    if (socketId && this.io) {
      this.io.to(socketId).emit(event, data);
    } else {
      console.log(`User ${userId} is not online`);
    }
  }

  // Emit event to all connected users (Global Broadcast)
  emitToAll(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    } else {
      console.log(`Socket server is not initialized.`);
    }
  }
}

module.exports = new SocketService();
