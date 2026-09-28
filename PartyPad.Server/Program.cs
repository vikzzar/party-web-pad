using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseWebSockets();

app.Map("/ws", async context =>
{   
    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    using var socket = await context.WebSockets.AcceptWebSocketAsync();

    Console.WriteLine("Controller connected!");

    var buffer = new byte[4096];

    while (socket.State == WebSocketState.Open)
    {
        var result = await socket.ReceiveAsync(
            new ArraySegment<byte>(buffer),
            CancellationToken.None
        );

        if (result.MessageType == WebSocketMessageType.Close)
        {
            await socket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Closing",
                CancellationToken.None
            );

            break;
        }

        var message = Encoding.UTF8.GetString(
            buffer,
            0,
            result.Count
        );

        Console.WriteLine($"Input: {message}");
    }

    Console.WriteLine("Controller disconnected!");
});

app.Run();