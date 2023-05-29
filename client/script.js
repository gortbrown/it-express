var ws = new WebSocket("ws://localhost:8081");
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
});

function CreateTicket(){
    var title = document.getElementById("titleBox").value;
    var description = document.getElementById("descriptionBox").value;
    var email = document.getElementById("emailBox").value;
    var newTicket = {title: title, description: description, email: email, status: "ToDo"}
    ws.send("Ticket~" + JSON.stringify(newTicket));
}



