const Document = require("./models/Document");

function socketEvents(io) {
    io.on("connection", socket => {
        socket.on("get-document", async documentId => {
            const document = await Document.findById(documentId);
    
            if (document) socket.emit("load-document", document.data); else socket.emit("document-not-found");
    
            socket.join(documentId);
    
            socket.on("save-document", async data => {
                await Document.findByIdAndUpdate(documentId, { data })
            })
    
            socket.on("send-changes", delta => {
                socket.broadcast.to(documentId).emit("receive-changes", delta);
            })
        });
        
        socket.on("create-document", async documentId => {
            Document.create({ _id: documentId, data: "" });
        });
    });
}

module.exports = socketEvents;