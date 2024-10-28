# web socket server

## description:
### the folders: [webSocket_server , WBS_test] contains a small test for a 2 programs contact each other using the web socket server.

## installation:
### 1 open every folder that metioned above (WBS_test contains 2 folders also open them) every foler in a seprate terminal.
### 2 run npm install for every terminal to download the needed packages.

## running:
### 1 in the webSocket_server terminal run node index.js
### 2 in the WBS_test in ws1 terminal run node ws1.js and the server will show that its connected
### 3 in the WBS_test in ws2 terminal run node ws2.js and the server will show that its connected

## result:
### now ws1 will encrypt hello message and send it to the server so the server redirect it to recieve it in ws2 and decrypt it and show it
### and ws2 will encrypt hello message and send it to the server so the server redirect it to recieve it in ws1 and decrypt it and show it
### and if you close ws1 or ws2 by ctrl + C the server will show that its disconnected and if you rerun it the server will show that its connected again
