# PartyPad (party-web-pad)

PartyPad turns a phone or another browser-equipped device into a gamepad for a Windows PC. A React interface sends controller state as JSON over WebSocket to an ASP.NET Core server, which creates a virtual Xbox 360 controller through ViGEm.

The interface provides A/B/X/Y buttons, a D-pad, shoulder buttons, digital triggers, and a left analog stick. Each WebSocket connection gets its own virtual controller, which is disconnected when the connection ends. A fullscreen/orientation toggle is available where the browser supports it.

## Tech stack

| Component | Technologies |
| --- | --- |
| Browser client | React 19, TypeScript 6, Vite 8, NippleJS 1, CSS |
| Server | C#, ASP.NET Core, .NET 10, WebSockets, `System.Text.Json` |
| Virtual gamepad | `Nefarius.ViGEm.Client` 1.21.256 and the ViGEm Bus Driver on Windows |
| Tooling | npm with `package-lock.json`, ESLint 10, .NET CLI |

No database or cloud service is used.

## Prerequisites

- A **Windows PC** to run the server and virtual controller.
- The **ViGEm Bus Driver**, installed separately on that PC. NuGet restore installs the client library only; this repository does not include a driver installer or specify a driver version.
- **.NET 10 SDK** (the server targets `net10.0`).
- **Node.js 24 or newer**, with npm, satisfying the locked Vite and ESLint engine requirements.
- **Git** and a browser with WebSocket and pointer-event support. A touchscreen is useful for playing from a phone.
- For phone access, the PC and phone must be able to reach each other on the local network.

The commands below use PowerShell. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

## Installation

Install the prerequisites, including the driver, then clone the repository and restore dependencies:

```powershell
git clone https://github.com/vikzzar/party-web-pad.git
cd party-web-pad
dotnet restore PartyPad.Server/PartyPad.Server.csproj
cd client
npm ci
cd ..
```

No `.env` file, credentials, database initialization, migrations, or seed data are required.

## Run locally

### 1. Start the server

From the repository root:

```powershell
dotnet run --project PartyPad.Server/PartyPad.Server.csproj --launch-profile http --urls http://0.0.0.0:5150
```

This builds the server and listens on port **5150** on all IPv4 interfaces, allowing phone access. The controller endpoint is `/ws`. Opening the server root does not show the UI: the repository has no server `wwwroot` directory or automatic client-copy step.

### 2. Start the client

In a second terminal, from the repository root:

```powershell
cd client
npm run dev
```

Open the URL printed by Vite, normally **http://localhost:5173**. Vite is already configured with `host: true` to allow network access. If port 5173 is occupied, use the alternate port printed in the terminal.

### 3. Connect a phone and check input

Open `http://<PC-LAN-IP>:5173` on the phone, replacing `<PC-LAN-IP>` with the Windows PC's local IPv4 address and adjusting the Vite port if needed. You can find that address with `ipconfig`. Do not use `localhost` on the phone: it refers to the phone itself.

Allow inbound access to the Vite port and TCP **5150** through the PC's firewall for the local network. The browser connects directly to `ws://<page-hostname>:5150/ws`, so both ports must be reachable. The current endpoint has no authentication; use it on a trusted local network.

With the page connected, run `joy.cpl` on Windows, select the virtual Xbox 360 controller, and check its properties while pressing buttons or moving the stick. Connection and input messages also appear in the server terminal. If the connection closes, reload the page; automatic reconnection is not implemented.

## Build and preview

From the repository root:

```powershell
dotnet build PartyPad.Server/PartyPad.Server.csproj --configuration Release
cd client
npm run build
npm run preview
```

The client build runs TypeScript checks and writes static assets to `client/dist/`. The preview command serves that build locally, normally at **http://localhost:4173**; keep the backend running on port 5150 to use the controller. For phone access to the preview, use `npm run preview -- --host 0.0.0.0`.

To run the server in Release configuration, use the server command above with `--configuration Release` added. Client assets are not bundled into the server build. Vite preview is for checking the build locally; the repository does not provide an integrated production hosting or Docker setup.

## Project structure

```text
party-web-pad/
|-- client/
|   |-- src/
|   |   |-- App.tsx                 # Touch controls, joystick, controller state
|   |   |-- App.css                 # Controller layout and button styles
|   |   |-- index.css               # Global styles
|   |   |-- main.tsx                # React entry point
|   |   `-- networking/websocket.ts # WebSocket connection and message sending
|   |-- package.json               # Dependencies and npm scripts
|   |-- package-lock.json          # Locked dependency versions
|   |-- vite.config.ts             # Network access and development proxy
|   |-- tsconfig*.json             # TypeScript project configuration
|   `-- eslint.config.js           # TypeScript and React lint rules
`-- PartyPad.Server/
    |-- Models/                    # Controller state, interface, ViGEm adapter
    |-- Properties/launchSettings.json
    |-- Program.cs                 # /ws endpoint and controller lifecycle
    |-- appsettings*.json          # Logging and host configuration
    `-- PartyPad.Server.csproj     # .NET target and NuGet dependency
```

## Useful commands

Run server commands from the repository root and npm commands from `client/`.

| Command | Purpose |
| --- | --- |
| `npm run lint` | Run ESLint on the client. |
| `npm run build` | Check TypeScript and create the client build. |
| `npm run preview` | Preview the built client locally. |
| `dotnet build PartyPad.Server/PartyPad.Server.csproj` | Build the server. |

No automated test suite or dedicated formatting command is configured.

## Configuration

| Location | Current behavior |
| --- | --- |
| `PartyPad.Server/Properties/launchSettings.json` | The `http` profile binds to `http://localhost:5150`; the `https` profile adds `https://localhost:7189`. Both set `ASPNETCORE_ENVIRONMENT=Development`. The documented `--urls` argument overrides the binding for LAN access. |
| `PartyPad.Server/appsettings.json` | Sets logging levels and `AllowedHosts` to `*`. `appsettings.Development.json` supplies development logging levels. |
| `client/src/networking/websocket.ts` | Hardcodes plain WebSocket (`ws://`), the page hostname, port `5150`, and path `/ws`. There is no client environment-variable override. |
| `client/vite.config.ts` | Enables network access and defines a `/ws` proxy to `ws://localhost:5150`. The current client uses a direct backend URL, so it bypasses that proxy. |

Keep backend port **5150** unless you also change the client URL. Use the HTTP workflow above with the current client; serving the UI over HTTPS requires adapting the connection to secure WebSocket (`wss://`). Fullscreen and orientation locking depend on browser support and may be unavailable over LAN HTTP.

The current input mapping includes only the left stick; L3/R3 exist in the state model but are neither rendered nor mapped to the virtual controller. L2/R2 send fully pressed or released values rather than analog pressure.
