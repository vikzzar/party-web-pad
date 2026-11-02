using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using PartyPad.Server.Models;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseWebSockets();

app.Map("/ws", async context => {   
    if (!context.WebSockets.IsWebSocketRequest) {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }
    var controllerID = Guid.NewGuid().ToString();
    using var socket = await context.WebSockets.AcceptWebSocketAsync();
    ViGemController controller = new ViGemController();
    controller.connect();
    Console.WriteLine("Controller connected!");

    var buffer = new byte[4096];

    try {
        while (socket.State == WebSocketState.Open) {
            var result = await socket.ReceiveAsync(
                new ArraySegment<byte>(buffer),
                CancellationToken.None
            );

            if (result.MessageType == WebSocketMessageType.Close) {
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

            //Console.WriteLine($"RAW: {message}");

            try {
                var controllerState =
                JsonSerializer.Deserialize<ControllerState>(
                    message,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                );
                if(controllerState != null) {
                    controller.update(controllerState);
                } 

                Console.WriteLine($"{controllerID} Input: {controllerState?.ToString()}");
            }
            catch (JsonException ex) {
                Console.WriteLine($"Invalid controller JSON: {message}");
                Console.WriteLine(ex.Message);
            }
        }
    }
    catch (WebSocketException ex) {
        Console.WriteLine(
            $"Controller {controllerID} connection lost: {ex.Message}"
        );
    }
    finally {
        controller.disconnect();
        Console.WriteLine($"Controller {controllerID} disconnected!");
    }
});

app.Run();