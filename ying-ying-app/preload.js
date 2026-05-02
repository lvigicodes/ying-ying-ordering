const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronPrinter', {
    // Print combined receipt (for pending orders - staff review)
    printCombined: (order) => {
        console.log('📤 preload.js: Sending printCombined to main process', order);
        ipcRenderer.send('print-order', { type: 'combined', order });
    },
    
    // Print payment receipt (for completed orders - customer copy)
    printPayment: (order) => {
        console.log('📤 preload.js: Sending printPayment to main process', order);
        ipcRenderer.send('print-order', { type: 'payment', order });
    },
    
    // Print to both kitchens (split receipts)
    printBoth: (order) => {
        console.log('📤 preload.js: Sending printBoth to main process', order);
        ipcRenderer.send('print-order', { type: 'both', order });
    },
    
    // Print to upper kitchen only
    printUpper: (order) => {
        console.log('📤 preload.js: Sending printUpper to main process', order);
        ipcRenderer.send('print-order', { type: 'upper', order });
    },
    
    // Print to lower kitchen only
    printLower: (order) => {
        console.log('📤 preload.js: Sending printLower to main process', order);
        ipcRenderer.send('print-order', { type: 'lower', order });
    },
    
    // Test print
    testPrint: (station) => {
        console.log('📤 preload.js: Sending testPrint to main process', station);
        ipcRenderer.send('test-print', station);
    }
});

console.log('✅ preload.js loaded - electronPrinter API exposed');