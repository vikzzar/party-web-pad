using PartyPad.Server.Models;

public interface IController {
    void update(ControllerState state);
    void connect();
    void disconnect();
}