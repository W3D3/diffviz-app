// in preload scripts, we have access to node.js and electron APIs
// the remote web app will not, so this is safe
const { ipcRenderer: ipc, remote, app, BrowserWindow, Menu, webContents} = require('electron');
const fs = remote.require('fs');

init();

function init() {
  attachIPCListeners();

  // Expose a bridging API to remote app's window.
  // We'll add methods to it here first, and when the remote web app loads,
  // it'll add some additional methods as well.
  //
  // !CAREFUL! do not expose any functionality or APIs that could compromise the
  // user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
  window.Bridge = {
    setDockBadge,
    // loadFilesFromArgs
  };
}

function attachIPCListeners() {
  // we get this message from the main process, and then tell diffviz to load the contents
  // the DiffViz app defines this function!
  ipc.on('transferArguments', (event, arg) => {
    window.Bridge.transferArguments(arg);
  });
}

function setDockBadge(count) {
  if(process.platform === 'darwin') {
    remote.app.dock.setBadge('' + (count || ''));
  }
}