import { useState } from 'react'
import './App.css'
import {connect, disconnect, sendMessage} from "./networking/websocket";

type ButtonID = "a" | "b" | "x" | "y" | "l1" | "r1" | "l2" | "r2" | "l3" | "r3" | "up" | "down" | "left" | "right";
type Button = {
  id: ButtonID;
  label: string;
  input: string;
}
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

type ControllerState = Record<ButtonID, boolean>;
const initialControllerState: ControllerState = {
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
};

function updatControllerState(previousState: ControllerState, buttonId: ButtonID, pressed: boolean): ControllerState {
  return {
    ...previousState,
    [buttonId]: pressed
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
  //connect();
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
                className={`button ${button.id}`}
                onClick={() => {
                  setControllerState(prevState => updatControllerState(prevState, button.id, !prevState[button.id]))
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
                  className={`button ${button.id}`}
                  onClick={() => {
                    setControllerState(prevState => updatControllerState(prevState, button.id, !prevState[button.id]))
                  }}
                  >
                  {button.label}
                  </button>
                ))
            }
          </div>
        </div>

        <div className="Face-Buttons">
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
                  className={`button ${button.id}`}
                  onClick={() => {
                    setControllerState(prevState => updatControllerState(prevState, button.id, !prevState[button.id]))
                  }}
                  >
                  {button.label}
                  </button>
                ))
            }
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
                  className={`button ${button.id}`}
                  onClick={() => {
                    setControllerState(prevState => updatControllerState(prevState, button.id, !prevState[button.id]))
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
