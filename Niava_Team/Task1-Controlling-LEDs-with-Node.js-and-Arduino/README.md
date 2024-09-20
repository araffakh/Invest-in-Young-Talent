# Task 1: Controlling LEDs with Node.js and Arduino

## Overview
In this task, **Arif** and **Shahed** worked together to build a system that allows an **Arduino** to communicate with a **Node.js** server. The goal is to control an LED using a simple web interface, which sends commands through the **Node.js** backend to the Arduino via serial communication.

## Objective
The main objective of this task is to provide users the ability to control an LED through a web interface. The web interface communicates with the **Node.js** backend, which in turn sends serial commands to the **Arduino** to control the state of the LED (on or off).

## Components Used
- **Arduino UNO**
- **LED**
- **Resistor (220Ω)**
- **Breadboard**
- **Jumper Wires**
- **USB Cable**
- **Node.js** for the backend server

## Steps

### 1. Arduino Setup
The Arduino will be set up with an LED connected to one of its digital pins. It will listen for serial inputs to control the LED's state. The specific code for this will be provided by **Shahed**.

### 2. Node.js Backend
A **Node.js** server will be created to receive commands from the web interface. It will communicate with the Arduino over a serial connection to control the LED. The backend code will be added by **Arif**.

### 3. Web Interface
A simple web interface will be created to send requests to the **Node.js** server. Users will have buttons to turn the LED on or off by sending commands via the browser. The code for this will also be provided by **Arif**.

## How It Works
- The **web interface** will provide buttons for the user to control the LED (on/off).
- The **Node.js backend** will listen to these requests and send the appropriate serial commands to the **Arduino**.
- The **Arduino** will receive the commands and control the LED accordingly.

## Learning Outcomes
- **Arif** learned about backend development using **Node.js** and serial communication.
- **Shahed** gained hands-on experience with **Arduino** and controlling hardware through serial inputs.
- Together, they built a simple, yet powerful, example of integrating **web development** with **hardware** control.

## Task
1. Connect to the **Mirte** robot.
2. Use the web interface to turn the LED on and off.
3. Document and upload the code for the **Node.js** backend and **Arduino** sketch.

---

This task serves as a fundamental introduction to combining **web development** with **robotics**. It sets the stage for more advanced tasks in the future, including the integration of additional sensors and actuators.
