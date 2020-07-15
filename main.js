// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const DiscordRPC = require('discord-rpc');

var url = require('url')
var http = require("http");
var server = http.createServer(function (req, res) {

    var fs = require('fs');
    var result = "";
    var target = url.parse(req.url)
    if (target.pathname === "/save") {
        var tosave = url.parse(req.url, true).query['data'];

        fs.writeFile('./resources/ui/setting.json', tosave, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Write operation complete.');
                var dt = new Date();
                var fs = require('fs');
                var file = ".\\resources\\ui\\setting.json";
                var result = JSON.parse(fs.readFileSync(file));

                dt.setHours(0);
                dt.setMinutes(0);
                dt.setSeconds(0);
                rpc.setActivity({
                    details: result.details,
                    state: result.state,
                    startTimestamp: dt,
                    largeImageKey: result.largeImageKey,
                    smallImageKey: result.smallImageKey,
                    instance: false,
                });
            }
        });

    } else if (target.pathname === "/") {
        result = fs.readFileSync("./resources/ui/index.html");
    } else if(target.pathname==="/close"){
        if (process.platform !== 'darwin') {app.quit()}
    }
    else
    {
        result = fs.readFileSync("./resources/ui/" + req.url);

    }
    // res.writeHead(200, {'Content-Type': 'text/*'});
    res.write(result);
    res.end();

}).listen(2715);

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        transparent:true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:2715')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var fs = require('fs');
var file = ".\\resources\\ui\\setting.json";
var result = JSON.parse(fs.readFileSync(file));
const clientId = result.clientID;

// only needed for discord allowing spectate, join, ask to join
DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({transport: 'ipc'});
const startTimestamp = new Date();

async function setActivity() {
    if (!rpc || !mainWindow) {
        return;
    }

    const boops = await mainWindow.webContents.executeJavaScript('window.boops');
    var dt = new Date();

    var fs = require('fs');
    var file = ".\\resources\\ui\\setting.json";
    var result = JSON.parse(fs.readFileSync(file));

    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    rpc.setActivity({
        details: result.details,
        state: result.state,
        startTimestamp: dt,
        largeImageKey: result.largeImageKey,
        smallImageKey: result.smallImageKey,
        instance: false,
    });
}

rpc.on('ready', () => {
    setActivity();
});

rpc.login({clientId}).catch(console.error);