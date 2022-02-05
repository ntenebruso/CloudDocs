const Document = require("./models/Document");
const mongoose = require("mongoose");

module.exports = function(io) {
    io.on("connection", socket => {
        socket.on("get-document", async documentId => {
            const document = await Document.findById(documentId);
    
            if (document) socket.emit("load-document", document); else socket.emit("document-not-found");
    
            socket.join(documentId);
    
            socket.on("save-document", async data => {
                await Document.findByIdAndUpdate(documentId, { data });
                socket.emit("save-successful");
            })
    
            socket.on("send-changes", delta => {
                socket.broadcast.to(documentId).emit("receive-changes", delta);
            })
        });
        
        socket.on("create-document", async (documentId, documentName, userId) => {
            await Document.create({ _id: documentId, name: documentName, data: "", userId });
            socket.emit("document-created");
        });
    });
}