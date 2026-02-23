const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    // Crea la finestra del browser
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        icon: path.join(__dirname, 'imgs/icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        backgroundColor: '#f5f7fa',
        show: false // Non mostrare finché non è pronta
    });

    // Carica index.html
    mainWindow.loadFile('index.html');

    // Mostra la finestra quando è pronta
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Menu personalizzato
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Home',
                    click: () => {
                        mainWindow.loadFile('index.html');
                    }
                },
                {
                    label: 'Preparazione',
                    click: () => {
                        mainWindow.loadFile('preparazione.html');
                    }
                },
                {
                    label: 'Ricettario',
                    click: () => {
                        mainWindow.loadFile('ricettario.html');
                    }
                },
                {
                    label: 'Ingredienti',
                    click: () => {
                        mainWindow.loadFile('ingredienti.html');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Esci',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Visualizza',
            submenu: [
                {
                    label: 'Ricarica',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom + 1);
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom - 1);
                    }
                },
                {
                    label: 'Zoom Reset',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        mainWindow.webContents.setZoomLevel(0);
                    }
                }
            ]
        },
        {
            label: 'Aiuto',
            submenu: [
                {
                    label: 'Informazioni',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Gelato Fiori Celesti',
                            message: 'Gelato Fiori Celesti\nVersione 1.0.0',
                            detail: 'Calcolatore ricette per gelateria artigianale\n\n© 2026 Fiori Celesti',
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Gestisci la chiusura della finestra
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Quando Electron ha finito l'inizializzazione
app.whenReady().then(createWindow);

// Esci quando tutte le finestre sono chiuse (tranne su macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Su macOS ricrea la finestra quando l'icona del dock viene cliccata
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
