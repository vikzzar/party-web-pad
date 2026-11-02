namespace PartyPad.Server.Models;

public class ButtonState {
    public bool A { get; set; }
    public bool B { get; set; }
    public bool X { get; set; }
    public bool Y { get; set; }
    public bool l1 { get; set; }
    public bool r1 { get; set; }
    public bool l2 { get; set; }
    public bool r2 { get; set; }
    public bool l3 { get; set; }
    public bool r3 { get; set; }
    public bool up { get; set; }
    public bool down { get; set; }
    public bool left { get; set; }
    public bool right { get; set; }
}
public class StickState {
    public double X { get; set; }
    public double Y { get; set; }
}
public class ControllerState {
    public ButtonState Buttons { get; set; } = new();
    public StickState LeftStick { get; set; } = new();

    public override string ToString()
    {
        return $"Buttons: A={Buttons.A}, B={Buttons.B}, X={Buttons.X}, Y={Buttons.Y}, l1={Buttons.l1}, r1={Buttons.r1}, l2={Buttons.l2}, r2={Buttons.r2}, l3={Buttons.l3}, r3={Buttons.r3}, up={Buttons.up}, down={Buttons.down}, left={Buttons.left}, right={Buttons.right}; LeftStick: X={LeftStick.X}, Y={LeftStick.Y}";
    }
}