const ws = new WebSocket("ws://localhost:8080");

function CreateTicket(){
    const title = document.getElementById("titleBox").value;
    const description = document.getElementById("descriptionBox").value;
    const email = document.getElementById("emailBox").value;
    var newTicket = `{
    "title": "${title}", 
    "description": "${description}", 
    "email": "${email}", 
    "status": "ToDo"
}`;
    SubmitTicket(newTicket);
}

function SubmitTicket(ticket){
    ws.addEventListener("open", (event) => {
        ws.send("init");
    });
    ws.addEventListener("message", (event) => {
        const msg = `${event.data}`;
        if(msg.includes("LoggedIn")){

        }
        else if(msg == "TicketError"){
            alert("There was a problem sending your ticket. Try again. If this issue persists, contact IT through email and let them know of your issue.");
        }
        else if(msg == "TicketAdded"){
            alert("Your ticket was successfully submitted! IT will respond to you as soon as possible!");
        }
        else if(msg == "Connected"){
            console.log("Connected to server!");
            console.log("If you're reading this, the governor of Misouri thinks you're a hacker :P");
        }
    });
}