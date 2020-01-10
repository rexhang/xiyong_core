// Modules to control application life and create native browser window
const electron = require('electron');
const {app, BrowserWindow, ipcMain, Notification} = electron;
const path = require('path');
const pkg = require('./package.json');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
	// const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize; // 全屏
	let width = 1920;
	let height = 1080;
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: width,
		height: height,
		fullscreen: false,
		backgroundColor: '#000',
		resizable: false,
		autoHideMenuBar: true,
		webPreferences: {
			devTools: true,
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	});
	// mainWindow.maximize();

	// switch and load the index.html of the app.
	if (pkg.DEV) {
		mainWindow.loadURL('http://localhost:3334/');
		// Open the DevTools.
		mainWindow.webContents.openDevTools();
	} else{
		// mainWindow.loadURL('https://www.xiyongzy.com/core/#/admin/core/prescribe');
		mainWindow.loadURL('http://127.0.0.1/core');
		// mainWindow.loadFile('./build/index.html');
	}

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {app.quit();}
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {createWindow();}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ipcMain.on('event1', (event, args) => {
// 	// let params = JSON.parse(args);
// 	mainWindow.setProgressBar(.1);
// 	fs.writeFile('./userconfig.ini', '[userconfig]\nuser='+args.user+'\npassword='+args.password, function(err) {
// 		if (err) {
// 			throw err;
// 		}
// 		setTimeout(function () {
// 			mainWindow.setProgressBar(1);
// 		}, 500);
// 		setTimeout(function () {
// 			mainWindow.setProgressBar(0);
// 		}, 1000);
// 	});
// 	event.reply('event1-reply', {receive: args, result: {msg: 'hello', Notification: Notification.isSupported()}});
// });