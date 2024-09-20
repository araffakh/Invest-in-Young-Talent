# Task 2: Expanding Control with Multiple LEDs and Servo Motor

## Overview
In this task, **Arif** and **Shahed** will build on their previous work by expanding the system to control multiple LEDs and a **servo motor** using **Node.js** and an **Arduino**. The task will also explore serial communication to handle multiple inputs and outputs efficiently.

## Objective
The objective of Task 2 is to enhance the existing project by adding:
1. Multiple LED control via a web interface.
2. Control of a **servo motor** to rotate to specific angles using the same interface.
3. Managing input/output pins on the **Arduino** effectively through serial communication.

## Components Used
- **Arduino UNO**
- **Multiple LEDs (5 or more)**
- **Resistors (220Ω each)**
- **Servo Motor**
- **Breadboard**
- **Jumper Wires**
- **USB Cable**
- **Node.js** for the backend server

## Steps

### 1. Arduino Setup
The **Arduino** will be set up with:
- 5 or more LEDs connected to separate digital pins.
- A **servo motor** connected to a PWM pin for rotation control.
- It will receive serial commands from the **Node.js** backend to control the LEDs and the servo motor. The specific code for this will be provided by **Shahed**.

### 2. Node.js Backend
The **Node.js** backend will handle multiple commands:
- Control individual LEDs (turn them on or off).
- Control the **servo motor** to rotate to a specific angle.
- The backend code will handle sending the correct serial commands to the Arduino for each task. This code will be provided by **Arif**.

### 3. Web Interface
The web interface will be expanded to:
- Include buttons for controlling each LED.
- Include input fields or sliders to control the angle of the **servo motor**.
- This code will also be provided by **Arif**.

## How It Works
- The **web interface** will have separate controls for each LED and the **servo motor**.
- The **Node.js backend** will process user input and send the appropriate serial commands to the **Arduino**.
- The **Arduino** will handle the serial inputs and control the LEDs and the **servo motor** accordingly.

### Serial Communication
The baud rate for the serial communication will be **115200** to ensure fast and reliable data transfer. This will help test the priority of the serial port and ensure efficient command handling.

## Learning Outcomes
- **Arif** will gain experience working with multiple outputs in **Node.js**, expanding his understanding of backend development and serial communication.
- **Shahed** will enhance his knowledge of **Arduino**, working with both digital outputs (LEDs) and analog outputs (servo motor control).
- Together, they will learn how to handle multiple devices via serial communication and control more complex robotic systems.

## Task
1. **Arif**: Expand the web interface to include controls for each LED and the **servo motor**.
2. **Shahed**: Modify the **Arduino** sketch to handle multiple LEDs and control the **servo motor**.
3. Test the system by turning on/off each LED and rotating the servo motor to various angles.
4. Document and upload the code for both the **Node.js** backend and **Arduino** sketch.

---

This task expands on the concepts learned in **Task 1**, introducing new components and more advanced control mechanisms. It sets the stage for future tasks involving sensors and more complex robotic systems.
