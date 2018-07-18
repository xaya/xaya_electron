import { app, BrowserWindow, screen, globalShortcut, Tray, Menu,clipboard  } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { PersistenceModule, IPersistenceContainer, StorageType } from 'angular-persistence';
import * as notifier from 'electron-notification-desktop';
 
 
let appIcon;
let serve, daemonExternal ;
let win: any;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

var iconpath = path.join(__dirname, 'user.ico') // path of y

try {
  require('dotenv').config();
} catch {

}

exports.NotifyTransaction  = (title, newmessage) => 
{
   notifier.notify(title, {
			  message: newmessage,
   })	
}

exports.CopyToClipboard  = (_text) => 
{
    clipboard.writeText(_text);	
}

		 
		 


exports.SetMainNetTray  = () => 
{

  let iconpath = "";
  
  if (serve) 
  {
	iconpath = path.join(__dirname, 'src/favicon_main.ico')  
	
  } 
  else 
  {
	iconpath = path.join(__dirname, 'dist/favicon_main.ico')  
	
  }

   appIcon.setImage(iconpath);

}

function createWindow() 
{

   
  // Create the browser window.
  
  if(serve)
  {
  
	  win = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {webSecurity: false},
		frame: false,
		show: false,
		backgroundColor: '#cc0000', 
		titleBarStyle: 'hidden',
		title: "Xyon Platform Wallet"
	  });
  }
  else
  {
	  win = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {webSecurity: false},
		frame: false,
		show: false,
		backgroundColor: '#cc0000',
        icon: path.join(__dirname, 'dist/favicon.256x256.png'),	
		titleBarStyle: 'hidden',
		title: "Xyon Platform Wallet"
	  });	  
  }
  
  if(serve)
  {
	    win.serve = true;
  }		  
  else
  {
	    win.serve = false;
  }
  
 
  let iconpath = ""; //tray icon path
  
  if (serve) 
  {
	  
	iconpath = path.join(__dirname, 'src/favicon.ico')  
	  
	  
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
	
  } 
  else 
  {
	  
	iconpath = path.join(__dirname, 'dist/favicon.ico')  
	  
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
	
	
  }
  

    appIcon = new Tray(iconpath);
  
    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () 
			{
                win.restore();
				win.show();
            }
        },
        {
            label: 'Quit', click: function () 
			{
				win.close();
            }
        }
    ])

    appIcon.setContextMenu(contextMenu) 
	
	appIcon.on('click', () => 
	{
       win.restore();
	   win.show();
    })
  

    globalShortcut.register('CommandOrControl+H', () => 
    {
	     win.webContents.openDevTools();
    })

  
  win.once('ready-to-show', () => 
  {
	    
	  win.show()
	  
  })
  
  win.on('minimize', function (event) {
        event.preventDefault()
        win.minimize()
   })

   win.on('show', function () {
        appIcon.setHighlightMode('always')
   })  
   
   
	let oldSize;
	
	setInterval(() => 
	{
		if(win)
		{
		oldSize = win.getSize();
		blockResizing--;
		}
	}, 10);
 
   let blockResizing = 0; //Bug with drag/resize relations workaround
   win.on('move', function () 
   {
	   blockResizing = 10;
   }) 
   
   win.on('resize', function () {
	   
	    if(blockResizing > 0)
		{
			return;
		}
	   
		let size = win.getSize();
		let widthChanged = oldSize[0] != size[0];
		var ratioY2X = 720 / 1280;
		if (widthChanged)
		{
			win.setSize(size[0], parseInt((size[0] * ratioY2X).toString()));
			win.webContents.send('resized', size[0], parseInt((size[0] * ratioY2X).toString()));
		}
		else
		{
			win.setSize(parseInt((size[1] / ratioY2X).toString()), size[1]);
			win.webContents.send('resized', parseInt((size[1] / ratioY2X).toString()), size[1]);
		}
		  
        
   })     
   
   win.on('hide', function () {
        appIcon.setHighlightMode('always')
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

	var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) 
	{
	  // Someone tried to run a second instance, we should focus our window.
	  if (win) 
	  {
		if (win.isMinimized()) win.restore();
		win.focus();
		win.show();
	  }
	});

	if (shouldQuit) 
	{
	  app.quit();
	}


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
