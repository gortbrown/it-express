const WebSocket = require("ws");
const filesystem = require("fs");

const server = new WebSocket.Server({ port: 8080 });
const fileData = filesystem.readFileSync("database.txt", "utf8");
const tickets = JSON.parse(fileData);
console.log("Server Started! :)");
server.on("connect", ws =>{
    ws.on("message", data => {
        var msg = `${data}`;
        if(msg.includes("ITLogin")){
            console.log("IT Staff Logged In.");
            var ticketsJson = JSON.stringify(tickets);
            ws.send("LoggedIn~" + ticketsJson);
        }
        // else if(msg == "EmployeeLogin"){
        //     console.log("Staff Member Logged In");
        // }
        //Ticket format: {"title": "Ticket Issue", "description": "Description of the issue.", "email": "person@email.com", "status": "Ticket Status"}
        else if(msg.includes("Ticket")){
            var msgSplit = msg.split("~");
            var ticket = Json.parse(msgSplit[1]);
            var prevLength = tickets.length;
            tickets.push(ticket);
            if(tickets.length == prevLength){
                console.log("Ticket wasn't added.");
                ws.send("TicketError");
            }
            else{
                console.log("Ticket added successfully.");
                ws.send("TicketAdded"); 
            }
        }
        //UpdateTicket format: UpdateTicket~index~NewStatus
        else if(msg.includes("UpdateTicket")){
            var msgSplit = msg.split("~");
            tickets[msgSplit[1]].status = msgSplit[2];
            console.log("Status changed to: " + tickets[msgSplit[1]].status);
        }
        else if(msg == "init"){
            console.log("Client Connected");
            ws.send("Connected");
        }
    });

    ws.on("close", () => {
        filesystem.writeFileSync("database.txt", JSON.stringify(tickets));
        console.log("Client Disconnected.");
    });
});