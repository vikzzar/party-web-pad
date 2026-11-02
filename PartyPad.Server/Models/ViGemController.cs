using PartyPad.Server.Models;
using Nefarius.ViGEm.Client;
using Nefarius.ViGEm.Client.Targets;
using Nefarius.ViGEm.Client.Targets.Xbox360;

public class ViGemController : IController {
    private ViGEmClient _client;
    private IXbox360Controller _controller;

    public ViGemController() {
        _client = new ViGEmClient();
        _controller = _client.CreateXbox360Controller();
    }

    public void update(ControllerState state) {
        _controller.SetButtonState(Xbox360Button.A, state.Buttons.A);
        _controller.SetButtonState(Xbox360Button.B, state.Buttons.B);
        _controller.SetButtonState(Xbox360Button.X, state.Buttons.X);
        _controller.SetButtonState(Xbox360Button.Y, state.Buttons.Y);

        _controller.SetButtonState(Xbox360Button.Left, state.Buttons.left);
        _controller.SetButtonState(Xbox360Button.Right, state.Buttons.right);
        _controller.SetButtonState(Xbox360Button.Up, state.Buttons.up);
        _controller.SetButtonState(Xbox360Button.Down, state.Buttons.down);

        _controller.SetButtonState(Xbox360Button.LeftShoulder, state.Buttons.l1);
        _controller.SetButtonState(Xbox360Button.RightShoulder, state.Buttons.r1);

        _controller.SetAxisValue(Xbox360Axis.LeftThumbX, (short)(state.LeftStick.X * short.MaxValue));
        _controller.SetAxisValue(Xbox360Axis.LeftThumbY, (short)(state.LeftStick.Y * short.MaxValue));

        _controller.SetSliderValue(Xbox360Slider.LeftTrigger, (byte)(state.Buttons.l2 ? byte.MaxValue : 0));
        _controller.SetSliderValue(Xbox360Slider.RightTrigger, (byte)(state.Buttons.r2 ? byte.MaxValue : 0));
    }
    public void connect() {
        _controller.Connect();
    }
    public void disconnect() {
        _controller.Disconnect();
    }
}