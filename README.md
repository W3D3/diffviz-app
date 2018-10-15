# Additions in the TodoMVC app for integrating with the Electron app
`isElectron` function to feature detect if we're in the Electron app or plain old web app:
https://github.com/ccnokes/electron-tutorials/blob/master/hybrid-app/remote-web-app/js/helpers.js#L51

`markAllAsComplete` function that the Electron app calls via IPC when the user clicks the corresponding menu item
https://github.com/ccnokes/electron-tutorials/blob/master/hybrid-app/remote-web-app/js/app.js#L19

`setDockBadge` function that sets the dock badge count on macOS
https://github.com/ccnokes/electron-tutorials/blob/master/hybrid-app/remote-web-app/js/controller.js#L232


# Installing and running
To run the Todo app from localhost: `cd remote-web-app` and `http-server`. 

Then `npm run start` to start the Electron app. 

You can verify that the web app works as normal by just going to `localhost:8080`. 

The todo app is included here locally just for convenience. In an actual app they'd be in separate locations. 
