import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win, serve, daemonExternal ;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

try {
  require('dotenv').config();
} catch {

}

function createWindow() 
{

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
	webPreferences: {webSecurity: false},
	frame: false,
	show: false,
	backgroundColor: '#cc0000', 
	titleBarStyle: 'hidden'
  });

  if (serve) {
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
	
	win.webContents.openDevTools();
	
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
	
	
	
  }

  
  
  win.once('ready-to-show', () => 
  {
	    
	  win.show()
	  
	  
	  const spawn = require('child_process').spawn;
	  if (serve) 
	  {
		  
	      
		  daemonExternal = spawn(path.join(__dirname, 'daemon/chimaera-qt.exe'), [ '-datadir=' + path.join(__dirname, 'daemon/datadir/'),'-addnode=46.101.15.140', '-rpcport=10133'], { detached: true, stdio: 'ignore'}, (error, stdout, stderr) => 
		  {
				if (error) 
				{
					console.error('chimaera stderr', stderr);
					throw error;
				}
				
		  });	
		  
	  }
	  else
	  {	  
		  daemonExternal = spawn(path.join(__dirname, '../daemon/chimaera-qt.exe'), [ '-datadir=' + path.join(__dirname, '../daemon/datadir/'),'-addnode=46.101.15.140', '-rpcport=10133'], { detached: true, stdio: 'ignore'}, (error, stdout, stderr) => 
		  {
				if (error) 
				{
					console.error('chimaera stderr', stderr);
					throw error;
				}
				
		  });
	  }  
	  
	  daemonExternal.unref();		
	  
  })
  
  

  
  // Emitted when the window is closed.
  win.on('closed', () => 
  {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

	

    win = null;
	
  });
  
  
  
  
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') 
	{
      app.quit();
    }
  });

  app.on('activate', () => 
  {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
