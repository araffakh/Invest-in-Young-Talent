const { app, BrowserWindow } = require('electron');
const hid = require('node-hid');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Example: Read data from a specific HID device
  const devices = hid.devices();
  const devicePath = devices.find((device) => device.path.includes('your_device_path'));

  if (devicePath) {
    const device = new hid.HID(devicePath);

    device.on('data', (data) => {
      console.log('Received data:', data);
      // Process the received data as needed
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});