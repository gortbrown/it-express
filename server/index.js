const ws = require('ws');
const fs = require('fs');
const server = new ws.Server({"port": "8080"});
const database = fs.readFileSync("database.txt");
if(database == ""){
    var tickets = [];
}
else{
    tickets = JSON.parse(database);
}

server.on("connection", socket => {
    socket.send("Connected");
    socket.on("message", data =>{
        var msg = `${data}`;
        if(msg == "init"){
            console.log("Client Connected")
        }
        else if(msg.includes("Login")){ //Just for IT page
            socket.send("Database~" + JSON.stringify(tickets));
            console.log("IT Logged In.");
        }
        else if(msg.includes("Ticket")){
            var msgSplit = msg.split("~");
            var newTicketJson = msgSplit[1];
            var newTicket = JSON.parse(newTicketJson);
            var oldLength = tickets.length;
            tickets[oldLength] = newTicket;
            if(tickets.length == oldLength){
                socket.send("TicketError");
                console.log("Ticket Add Failed");
            }
            else{
                socket.send("TicketAdded");
                console.log("Ticket successfully Added");
            }
        }
        else if(msg.includes("UpdateTicket")){
            var msgSplit = msg.split("~");
            var index = msgSplit[1];
            tickets[index].status = msgSplit[2];
        }
    });
    socket.on("close", ()=>{
        fs.writeFileSync("database.txt", JSON.stringify(tickets));
        console.log("Client Disconnected");
    });
});