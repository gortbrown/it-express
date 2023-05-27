var ws = new WebSocket("ws://localhost:8080");
var tickets = [];

ws.addEventListener("open", (event) => {
    ws.send("init");
});

ws.addEventListener("message", (event) =>{
    if(event.data == "Connected"){
        console.log("You're Connected!");
    }
    else if(event.data == "TicketError"){
        alert("Failed to submit ticket. Try again later.");
    }
    else if(event.data == "TicketAdded"){
        alert("Ticket submitted successfully!");
    }
    else if(event.data.includes("Database")){
        msgSplit = event.data.split("~");
        tickets = JSON.parse(msgSplit[1]);
        LoadTickets();
    }
});

function CreateTicket(){
    var title = document.getElementById("titleBox").value;
    var description = document.getElementById("descriptionBox").value;
    var email = document.getElementById("emailBox").value;
    var newTicket = {title: title, description: description, email: email, status: "ToDo"}
    ws.send("Ticket~" + JSON.stringify(newTicket));
}

function HandleLogin(){
    ws.send("Login");
}

function LoadTickets(){
    var ticketViewHtml = "";
    tickets.forEach(t => {
        var ticketHtml = `<h2>${t.title}</h2>
        <h4>From: ${t.title}</h4>
        <h4>Status: ${t.status}</h4>
        <p>${t.description}</p>`;

        ticketViewHtml.concat(ticketHtml);
    });
    document.getElementById("ticketview").innerHTML = ticketViewHtml;
}