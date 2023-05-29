const ws = require('ws');
const fs = require('fs');
const server = new ws.Server({"port": "8081"});
const ticketDatabase = fs.readFileSync("database.txt");
const loginDatabase = fs.readFileSync("login.txt");

if(ticketDatabase == ""){
    var tickets = [];
}
else{
    var tickets = JSON.parse(ticketDatabase);
}
if(ticketDatabase == ""){
    var login = {username: "admin", password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"};
}
else{
    var login = JSON.parse(loginDatabase);
}

server.on("connection", socket => {
    socket.send("Connected");
    socket.on("message", data =>{
        var msg = `${data}`;
        if(msg == "init"){
            console.log("Client Connected")
        }
        else if(msg.includes("Login")){ //Just for IT page
            console.log("Login in progress...");
            msgSplit = msg.split("~");
            
            if(login.username == msgSplit[1] && login.password == msgSplit[2]){
                //Checks if the hash matches the one for "admin"
                if(login.password == "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"){
                    socket.send("ChangePassword");
                    console.log("Password is default. Asking to change.")
                }
                else{
                    socket.send("Database~" + JSON.stringify(tickets));
                    console.log("IT Logged In.");
                }
            }
            else{
                socket.send("LoginInvalid");
                console.log("Login failed.");
            }
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
        else if(msg.includes("Update")){
            var msgSplit = msg.split("~");
            var index = msgSplit[1];
            var status = msgSplit[2];
            tickets[index].status = status;
            socket.send(`Updated~${index}~${status}`);
        }
        else if(msg.includes("NewPassword")){
            var msgSplit = msg.split("~");
            login.password = msgSplit[1];
            console.log("Password Updated");
            socket.send("Database~" + JSON.stringify(tickets));
            console.log("IT Logged In.");
        }
    });
    socket.on("close", ()=>{
        fs.writeFileSync("database.txt", JSON.stringify(tickets));
        fs.writeFileSync("login.txt", JSON.stringify(login));
        console.log("Client Disconnected");
    });
});