import { useEffect, useRef, useState } from 'react'
import './App.css'
import {connect, disconnect, sendMessage} from "./networking/websocket";
import nipplejs from 'nipplejs';

//define button, stick and controller state types
type ButtonID = "a" | "b" | "x" | "y" | "l1" | "r1" | "l2" | "r2" | "l3" | "r3" | "up" | "down" | "left" | "right";

type StickState = {
  x: number;
  y: number;
}
type Button = {
  id: ButtonID;
  label: string;
  input: string;
}


type ControllerState ={ 
  buttons: Record<ButtonID, boolean>;
  leftStick: StickState;
}

//store button data in an array
const buttons: Button[] = [
  { id: "a", label: "A", input: "A" },
  { id: "b", label: "B", input: "B" },
  { id: "x", label: "X", input: "X" },
  { id: "y", label: "Y", input: "Y" },
  { id: "l1", label: "L1", input: "L1" },
  { id: "r1", label: "R1", input: "R1" },
  { id: "l2", label: "L2", input: "L2" },
  { id: "r2", label: "R2", input: "R2" },
  { id: "l3", label: "L3", input: "L3" },
  { id: "r3", label: "R3", input: "R3" },
  { id: "up", label: "Up", input: "Up" },
  { id: "down", label: "Down", input: "Down" },
  { id: "left", label: "Left", input: "Left" },
  { id: "right", label: "Right", input: "Right" }
];

const initialControllerState: ControllerState = {
  buttons: {
    a: false,
    b: false,
    x: false,
    y: false,
    l1: false,
    r1: false,
    l2: false,
    r2: false,
    l3: false,
    r3: false,
    up: false,
    down: false,
    left: false,
    right: false
  },
  leftStick: {
    x: 0,
    y: 0
  }
};

function updateButtonState(previousState: ControllerState, buttonId: ButtonID, pressed: boolean): ControllerState {
  return {
    ...previousState,
    buttons: {
      ...previousState.buttons,
      [buttonId]: pressed
    }
  }
}

function updateStickState(previousState: ControllerState, stickState: StickState): ControllerState {
  return {
    ...previousState,
    leftStick: stickState 
  }
}

async function setToLandscapeMode(): Promise<void> {
  const isFullScreen : boolean = document.fullscreenElement !== null;
  const isLandscape : boolean = screen.orientation?.type.startsWith("landscape") ?? false; 
  
  try {
      if(!isFullScreen) {
        await document.documentElement.requestFullscreen({
          navigationUI: "hide",
        });
      }
      if(isFullScreen) {
        await document.exitFullscreen();
      }
      if (screen.orientation?.lock) {
        if(!isLandscape) {
          await screen.orientation.lock("landscape");
        }
        if(isLandscape) {
          await screen.orientation.lock("portrait");
        }
      }
    } catch (error) {
      console.log("Fullscreen/orientation not supported:", error);
    }
}

function App() {
  const [controllerState, setControllerState] = useState<ControllerState>(initialControllerState);
  const joystickZoneRef = useRef<HTMLDivElement | null>(null);

  // connect to the WebSocket server when the component mounts
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    }
  }, []);

  // send the controller state to the server whenever it changes
  useEffect(() => {
    const message = JSON.stringify(controllerState);
    sendMessage(message);
  }, [controllerState]);
  

  // initialize the joystick when the component mounts
  useEffect(() => {
    if(!joystickZoneRef.current){ return; };

      const joystick = nipplejs.create({
        zone: joystickZoneRef.current,
        mode: "static",
        position: {
          left: "50%",
          top: "50%"
        },
        size: 120,
        color: "black"
      });

      joystick.on("move", (event) => {
        const vector = event.data.vector;
        const currentLeftStickState : StickState = {
          x: vector.x,
          y: vector.y
        } 
        setControllerState(prevState => updateStickState(prevState, currentLeftStickState));
        //console.log(controllerState.leftStick.x, controllerState.leftStick.y);
      });

      joystick.on("end", () => {
        setControllerState(prevState => updateStickState(prevState, {x : 0, y : 0}));
      });

      return () => {
        joystick.destroy();
      };
  }, []);

  function pressButton(buttonId: ButtonID): void {
    setControllerState(prevState => updateButtonState(prevState, buttonId, true));
  }

  function releaseButton(buttonId: ButtonID): void {
    setControllerState(prevState => updateButtonState(prevState, buttonId, false));
  }
  
  return (
    <>
      <section id="controller-container">
        <button
        type="button"
        className="controller-mode-button"
        onClick={setToLandscapeMode}
        >
          landscape mode
        </button>
        <div className = "Bumbers">
          {/* Left Bumbers */}
          <div className="Left-Bumbers">
          {
            buttons.filter((button) => 
              button.id === "l1" || 
              button.id === "l2")
              .map((button) => (
                <button
                key={button.id}
                type="button"
                className={`button ${button.id} ${
                  controllerState.buttons[button.id] ? "pressed" : ""
                }`}
                onPointerDown={(event) =>{
                  event.currentTarget.setPointerCapture(event.pointerId);
                  pressButton(button.id);
                }}
                onPointerUp={(event) => {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                  releaseButton(button.id)}
                }
                onPointerCancel={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }

                  releaseButton(button.id);
                }}
                >
                {button.label}
                </button>
              ))
          }
          </div>
          
          {/* Right Bumbers */}
          <div className="Right-Bumbers">
            {
              buttons.filter((button) => 
                button.id === "r1" || 
                button.id === "r2")
                .map((button) => (
                  <button
                  key={button.id}
                  type="button"
                  className={`button ${button.id} ${
                    controllerState.buttons[button.id] ? "pressed" : ""
                  }`}
                  onPointerDown={(event) =>{
                  event.currentTarget.setPointerCapture(event.pointerId);
                  pressButton(button.id);
                }}
                onPointerUp={(event) => {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                  releaseButton(button.id)}
                }
                onPointerCancel={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }

                  releaseButton(button.id);
                }}
                  >
                  {button.label}
                  </button>
                ))
            }
          </div>
        </div>

        <div className="Face-Buttons">
          {/*directional input*/}
          <div className="Directional-Input">
            {/* Directional Buttons */}
            <div className="Directional-Buttons">
              {
                buttons.filter((button) => 
                  button.id === "up" || 
                  button.id === "down" || 
                  button.id === "left" || 
                  button.id === "right")
                  .map((button) => (
                    <button
                    key={button.id}
                    type="button"
                    className={`button ${button.id} ${
                      controllerState.buttons[button.id] ? "pressed" : ""
                    }`}
                    onPointerDown={(event) =>{
                    event.currentTarget.setPointerCapture(event.pointerId);
                    pressButton(button.id);
                  }}
                  onPointerUp={(event) => {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                    releaseButton(button.id)}
                  }
                  onPointerCancel={(event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                      event.currentTarget.releasePointerCapture(event.pointerId);
                    }

                    releaseButton(button.id);
                  }}
                    >
                    {button.label}
                    </button>
                  ))
              }
            </div>
            {/* Joystick */}
            <div className="Joystick-Zone" ref={joystickZoneRef}></div>
          </div>
          {/* Action Buttons */}
          <div className="Action-Buttons">
            {
              buttons.filter((button) => 
                button.id === "a" || 
                button.id === "b" || 
                button.id === "x" || 
                button.id === "y")
                .map((button) => (
                  <button
                  key={button.id}
                  type="button"
                  className={`button ${button.id} ${
                    controllerState.buttons[button.id] ? "pressed" : ""
                  }`}
                  onPointerDown={(event) =>{
                  event.currentTarget.setPointerCapture(event.pointerId);
                  pressButton(button.id);
                }}
                onPointerUp={(event) => {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                  releaseButton(button.id)}
                }
                onPointerCancel={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }

                  releaseButton(button.id);
                }}
                  >
                  {button.label}
                  </button>
                ))
            }
          </div>
        </div>
      </section>
    </>
  )
}

export default App
