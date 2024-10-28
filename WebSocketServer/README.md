`# Invest in Young Talent - WebSocket Server with Joystick and Arduino Clients

This project includes a WebSocket server that facilitates communication between two applications: a joystick client and an Arduino client. The WebSocket server routes messages between these clients, enabling seamless data exchange.

The server is hosted on Render and is accessible at [invest-in-young-talent.onrender.com](https://invest-in-young-talent.onrender.com). The Arduino and Joystick applications connect to this WebSocket server, allowing data transmission between them.

## Project Structure

- **server.js**: WebSocket server code that handles message routing between joystick and Arduino clients.
- **joystick.js**: Node.js application for the joystick, connecting to the WebSocket server to send joystick data.
- **arduino.js**: Node.js application for the Arduino, connecting to the WebSocket server to send Arduino data.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/araffakh/Invest-in-Young-Talent.git
   cd WebSocketServer

1.  **Install Dependencies**: Install the `ws` package required for WebSocket communication in each application:

    `npm install ws`

Configuration
-------------

-   Update the `joystick.js` and `arduino.js` files with the WebSocket server URL, setting `SERVER` to `"invest-in-young-talent.onrender.com"`.
-   No additional configuration is needed since the WebSocket server is hosted online.

Running the Applications
------------------------

### 1\. Start the WebSocket Server

If you wish to run the WebSocket server locally (rather than on Render), start it by running:

`node server.js`

### 2\. Run the Joystick and Arduino Clients

Once the server is running, start each client in separate terminal windows:

`node joystick.js   # Starts the joystick client
node arduino.js    # Starts the Arduino client`

The clients will connect to the WebSocket server and exchange data.

Example Usage
-------------

The `joystick.js` and `arduino.js` files include code that sends example data every second. The WebSocket server will route messages between the clients based on their identification as either "joystick" or "arduino," and each client logs incoming messages from the server to the console.

Notes
-----

-   The WebSocket server is deployed on Render, so the joystick and Arduino clients should work with `SERVER` set to `"invest-in-young-talent.onrender.com"`.
-   The clients and server communicate using the secure WebSocket protocol (`wss`).

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.

