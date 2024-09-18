// Socket.io 
const {Chat} = require('../models');
function socket(io){
    io.on("connection", (socket) => {
        socket.on("join",function(room){
            socket.join(room)
            // io.to(room).emit("join", socket.id);
        })
        

        socket.on('send', async (msg) => {
            await sendMsg(msg)
            if(!isNaN(msg.friend)) io.to(parseInt(msg.friend)).emit('send', msg);
            
            
        });
    
  
        socket.on("disconnect", async () => {  
            socket.broadcast.emit("destroy", socket.id);
        });
  }); 
}

async function sendMsg(obj){
    await Chat.bulkCreate([
        {
            user_mobile:obj.user,
            friend_mobile:obj.friend,
            status:'send',
            msg:obj.msg
        },
        {
            user_mobile:obj.friend,
            friend_mobile:obj.user,
            status:'receive',
            msg:obj.msg
        },
    ])
}

module.exports = socket
