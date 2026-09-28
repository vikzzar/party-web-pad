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

function App() {
  const [controllerState, setControllerState] = useState<ControllerState>(initialControllerState);
  //connect();
  return (
    <>
      <section id="center">
        {buttons.map((button) => (
          <button
            key={button.id}
            type="button"
            className="counter"
            onClick={() => {
              setControllerState(prevState => updatControllerState(prevState, button.id, !prevState[button.id]))
            }}
          >
            {button.label}
          </button>
        ))}
          
        
          
        <button
          type="button"
          className="counter"
          onClick={() => console.log(controllerState)}
        >
          show state
        </button>
      </section>
    </>
  )
}

export default App
