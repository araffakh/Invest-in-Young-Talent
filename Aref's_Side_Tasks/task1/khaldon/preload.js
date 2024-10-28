// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
  listHIDDevices: () => ipcRenderer.invoke('listHIDDevices')
});