const io = require('socket.io')(5000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on('connection', socket => {
    const userId = socket.handshake.query.userId
    socket.join(userId)

    socket.on('send-message', ({ recipientId, input }) => {
        socket.broadcast.to(recipientId).emit('receive-message', {
            recipientId: recipientId, senderId: userId, input
        })
    })
})