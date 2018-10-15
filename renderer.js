const {ipcRenderer} = require('electron');
const $webview = document.querySelector('webview');
const $loader = document.querySelector('.loader');
let isInitialLoad = true;

function pageLoaded(){
    console.log('The page is loade');
    ipcRenderer.send('ready',"Im ready");
    
}

$webview.addEventListener('did-start-loading', () => {
  // we use client side rendering so the loader is only needed on the first page load
  if(isInitialLoad) {
    $webview.classList.add('hide');
    $loader.classList.remove('loader-hide');
    isInitialLoad = false;
  }
});

// window.addEventListener("load", function load(event) {
//   console.log("__loaded")
//   pageLoaded();  
// });

$webview.addEventListener('dom-ready', () => {
  $webview.classList.remove('hide');
  
  // have to delay in order for the webview show/resize to settle
  setTimeout(() => {
    $loader.classList.add('loader-hide');
  }, 1000);

  var remote = require('electron').remote;
  var arguments = remote.getGlobal('sharedObject').args;

  console.log(arguments);
  // pageLoaded();
  // setTimeout(() => {
  //   pageLoaded();
  // }, 3000);
    
});

// this is just for development convenience
// (because the todo app's dev tools are in a separate process)
window.openWebviewDevTools = () => {
  $webview.getWebContents().openDevTools();
};

