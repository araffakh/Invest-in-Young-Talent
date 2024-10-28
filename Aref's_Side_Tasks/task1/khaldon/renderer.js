// renderer.js
document.getElementById('list-devices').addEventListener('click', async () => {
    const devices = await window.API.listHIDDevices();
    const devicesDiv = document.getElementById('devices');
    devicesDiv.innerHTML = '';
    devices.forEach(device => {
      const deviceElement = document.createElement('p');
      deviceElement.textContent = `Vendor ID: ${device.vendorId}, Product ID: ${device.productId}`;
      devicesDiv.appendChild(deviceElement);
    });
  });