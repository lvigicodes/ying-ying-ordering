const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const printer = require('./printer');

let mainWindow;

// Load printer configuration
const configPath = path.join(__dirname, 'printer-config.json');
let config = {
    environment: 'production',
    productionURL: 'https://ying-ying-ordering.vercel.app/staff.html',
    stagingURL: 'https://ying-ying-ordering-git-staging-lvigiworks-2695s-projects.vercel.app/staff.html',
    staffPrinterIP: '192.168.68.91',
    upperPrinterIP: '192.168.68.92',
    lowerPrinterIP: '192.168.68.93',
    printerPort: 9100
};

// Load config if exists
if (fs.existsSync(configPath)) {
    try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('✅ Loaded printer configuration:', config);
    } catch (err) {
        console.error('❌ Error loading config, using defaults:', err);
    }
} else {
    // Create default config file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Created default printer-config.json');
}

// Update printer IPs from config
printer.staffPrinterIP = config.staffPrinterIP;
printer.upperPrinterIP = config.upperPrinterIP;
printer.lowerPrinterIP = config.lowerPrinterIP;
printer.printerPort = config.printerPort;

console.log('🖨️ Ying Ying Staff Desktop App initialized');

// IPC handlers MUST be registered BEFORE app.whenReady()
ipcMain.handle('print-combined', async (event, order) => {
    console.log('📞 IPC: print-combined called');
    console.log('Order:', order.orderId);
    return await printer.printCombined(order);
});

ipcMain.handle('print-payment', async (event, order) => {
    console.log('📞 IPC: print-payment called');
    console.log('Order:', order.orderId);
    return await printer.printPayment(order);
});

ipcMain.handle('print-upper', async (event, order) => {
    console.log('📞 IPC: print-upper called');
    console.log('Order:', order.orderId);
    return await printer.printUpper(order);
});

ipcMain.handle('print-lower', async (event, order) => {
    console.log('📞 IPC: print-lower called');
    console.log('Order:', order.orderId);
    return await printer.printLower(order);
});

ipcMain.handle('print-both', async (event, order) => {
    console.log('📞 IPC: print-both called');
    console.log('Order:', order.orderId);
    return await printer.printBoth(order);
});

ipcMain.handle('test-print', async (event) => {
    console.log('📞 IPC: test-print called');
    console.log('🖨️ Testing printer connection...');
    console.log('📍 Staff Printer:', config.staffPrinterIP);
    
    // Simple test: try to connect to printer
    const testReceipt = printer.init() + 'TEST PRINT\n\n' + printer.cut();
    
    try {
        await printer.sendToPrinter(config.staffPrinterIP, config.printerPort, testReceipt);
        console.log('✅ Test print sent!');
        return { success: true };
    } catch (err) {
        console.error('❌ Test print failed:', err);
        return { success: false, error: err.message };
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Load the staff dashboard (production or staging, based on printer-config.json)
    const dashboardURL = config.environment === 'staging'
        ? config.stagingURL
        : config.productionURL;
    console.log(`🌐 Loading dashboard (${config.environment || 'production'}):`, dashboardURL);
    mainWindow.loadURL(dashboardURL);

    // Open DevTools in development (comment out for production)
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    console.log('🚀 Ying Ying Staff Dashboard started');
    console.log('📍 Staff Printer:', config.staffPrinterIP);
    console.log('📍 Upper Kitchen:', config.upperPrinterIP);
    console.log('📍 Lower Kitchen:', config.lowerPrinterIP);
}

// Auto-start on Windows boot
app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
