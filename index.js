const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const messageRoute = require('./routes/messages');
const socket = require('socket.io');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log(`DB connection successfull`))
	.catch(err => console.log(err.message));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoute);

const server = app.listen(process.env.PORT, () =>
	console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
	cors: process.env.ORIGIN_LOCAL || process.env.ORIGIN_PRODUCTION,
	credentials: true,
});

global.onlineUsers = new Map();
io.on('connection', socket => {
	global.chatSocket = socket;
	socket.on('add-user', userId => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on('send-msg', data => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('msg-receive');
		}
	});
});
