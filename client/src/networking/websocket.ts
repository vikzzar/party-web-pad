let socket : WebSocket | null = null;

export function connect() {
    if (!socket) {
        socket = new WebSocket(`ws://${window.location.hostname}:5150/ws`);
    }

    
    socket.onopen = () => {
        console.log("WebSocket connection established.");
    };
    socket.onclose = () => {
        console.log("WebSocket connection closed.");
        socket = null;
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
export function disconnect(){
    if (socket) {
        socket.close();
        socket = null;
    }
}