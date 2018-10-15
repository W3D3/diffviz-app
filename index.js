const { app, BrowserWindow, Menu, webContents, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs')
let mainWindow;
let webviewId;
var endpoint;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    minWidth: 1100,
    minHeight: 700,
    height: 800,
    width: 1400
    // titleBarStyle: 'hidden-inset',
    // frame: false
  });
  
  if (isDev()) {
    mainWindow.loadURL(path.join('file://', __dirname, 'index.dev.html'));
    mainWindow.openDevTools({ mode: 'bottom' });
    endpoint = 'localhost';
  } else {
    mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));
    endpoint = 'swdyn.aau.at';
  }
  


  console.log(process.argv);
  global.sharedObject = {args: process.argv}

  createMenu();
  // ipcMain.on('ready', doSomething)
  setTimeout(() => {
    startWithArguments();
  }, 3000);
});

app.on('window-all-closed', () => {
  app.quit()
})

function startWithArguments(){
  var args = process.argv;
  console.log('Everything should be ready.');
  args.splice(0, 1); // first arg is always binary
  if (args[0] == "index.js") args.splice(0, 1); // second arg can be index.js when not bundled
  console.log(args)
  loadFiles(args);
}

// get the webview's webContents
function getWebviewWebContents() {
  return webContents.getAllWebContents()
    // TODO replace `localhost` with whatever the remote web app's URL is
    .filter(wc => wc.getURL().search(new RegExp(endpoint, "gi")) > -1)
    .pop();
}

function createMenu() {

  const topLevelItems = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
      ]
    },
    // {
    //   label: 'Actions',
    //   submenu: [
    //     {
    //       label: 'Transfer arguments',
    //       click() {
    //         // send an IPC message to the webview for handling
    //         console.log(global.sharedObject.args);

    //         startWithArguments(global.sharedObject.args);
    //       }
    //     }
    //   ]
    // }
    {
        label: 'Debug',
        submenu: [
          {
            label: 'Open Dev Tools',
            click() {
              mainWindow.openDevTools({ mode: 'bottom' });
            }
          }
        ]
      }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(topLevelItems));
}

/**
 * 
 * @param {Array} files array with the two text file paths
 */
function loadFiles(files) {
  if(files.length < 2) return;

  fs.readFile(files[0], function (err, data) {
    if (err) {
      return console.error(err);
    }

    global.sharedObject.file1 = data.toString();
    fs.readFile(files[1], function (err, data) {
      if (err) {
        return console.error(err);
      }

      global.sharedObject.file2 = data.toString();
      getWebviewWebContents().send('transferArguments', { file1: global.sharedObject.file1, file2: global.sharedObject.file2 });
    });
  });
}

function isDev() {
  return process.mainModule.filename.indexOf('app.asar') === -1;
}