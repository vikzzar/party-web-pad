let socket : WebSocket | null = null;

export function connect() {
    if (socket) {
        return;
    }

    const newSocket = new WebSocket(`ws://${window.location.hostname}:5150/ws`);
    socket = newSocket;
    
    socket.onopen = () => {
        console.log("WebSocket connection established.");
    };
    socket.onclose = () => {
        console.log("WebSocket connection closed.");
        if(socket === newSocket){
            socket = null;
        }
    }
    socket.onmessage = (event) => {
        console.log("Received message:", event.data);
    };
    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    }
}

export function sendMessage(message: string) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    }
}
export function disconnect() {
    if (socket) {
        const socketToClose = socket;
        socket = null;
        socketToClose.close();
    }
}