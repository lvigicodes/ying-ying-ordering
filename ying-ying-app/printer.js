const net = require('net');

class KitchenPrinter {
    constructor() {
        // Printer IP addresses
        this.upperPrinterIP = '10.0.3.1';
        this.lowerPrinterIP = '10.0.3.1'; // Same for now, update when second printer arrives
        this.printerPort = 9100;
        
        console.log('🖨️ Printer module initialized');
        console.log(`🔧 Upper Kitchen: ${this.upperPrinterIP}:${this.printerPort}`);
        console.log(`🔧 Lower Kitchen: ${this.lowerPrinterIP}:${this.printerPort}`);
    }

    // ESC/POS Commands
    get ESC() { return '\x1B'; }
    get GS() { return '\x1D'; }
    
    init() { return this.ESC + '@'; }
    alignCenter() { return this.ESC + 'a' + '\x01'; }
    alignLeft() { return this.ESC + 'a' + '\x00'; }
    bold(on) { return this.ESC + 'E' + (on ? '\x01' : '\x00'); }
    cut() { return this.GS + 'V' + '\x41' + '\x03'; }
    textSize(width, height) { 
        const size = ((width - 1) << 4) | (height - 1);
        return this.GS + '!' + String.fromCharCode(size);
    }

    // Generate combined receipt (for pending orders - staff review)
    generateCombinedReceipt(order) {
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });

        let receipt = this.init();
        receipt += this.alignCenter();
        receipt += '================================\n';
        receipt += this.bold(true);
        receipt += this.textSize(2, 2);
        receipt += 'YING YING\n';
        receipt += this.textSize(1, 1);
        receipt += this.bold(false);
        receipt += '================================\n';
        receipt += this.bold(true);
        receipt += 'REVIEW RECEIPT\n';
        receipt += '(Pending - Confirm with Customer)\n';
        receipt += this.bold(false);
        receipt += '================================\n\n';

        receipt += this.alignLeft();
        receipt += `Order: ${order.orderId}\n`;
        receipt += `Table: ${order.tableNumber}\n`;
        receipt += `Time: ${time}\n`;
        receipt += '--------------------------------\n';
        receipt += this.bold(true);
        receipt += 'ALL ITEMS:\n';
        receipt += this.bold(false);
        receipt += '--------------------------------\n';

        // Show all items with station tags
        order.items.forEach(item => {
            let line = `${item.quantity}x ${item.name}`;
            if (item.variation) {
                line += ` (${item.variation})`;
            }
            receipt += line + '\n';
            receipt += `   P${item.price} x ${item.quantity} = P${item.price * item.quantity}\n`;
            receipt += `   [${item.station.toUpperCase()} KITCHEN]\n`;
        });

        receipt += '================================\n';
        receipt += this.bold(true);
        receipt += this.textSize(1, 1);
        receipt += `TOTAL: P${order.total}\n`;
        receipt += this.textSize(1, 1);
        receipt += this.bold(false);
        receipt += '================================\n';
        receipt += 'Please confirm order accuracy\n';
        receipt += 'with customer before confirming.\n';
        receipt += '================================\n';
        receipt += '\n\n\n';
        receipt += this.cut();

        return receipt;
    }

    // Generate split kitchen receipt
    generateKitchenReceipt(order, station) {
        const stationName = station === 'upper' ? 'UPPER KITCHEN' : 'LOWER KITCHEN';
        const items = order.items.filter(item => item.station === station);

        if (items.length === 0) {
            return null;
        }

        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });

        let receipt = this.init();
        receipt += this.alignCenter();
        receipt += '================================\n';
        receipt += this.bold(true);
        receipt += this.textSize(2, 2);
        receipt += 'YING YING\n';
        receipt += this.textSize(1, 1);
        receipt += this.bold(false);
        receipt += '================================\n';
        receipt += this.bold(true);
        receipt += `${stationName}\n`;
        receipt += this.bold(false);
        receipt += '================================\n\n';

        receipt += this.alignLeft();
        receipt += `Order: ${order.orderId}\n`;
        receipt += `Table: ${order.tableNumber}\n`;
        receipt += `Time: ${time}\n`;
        receipt += '--------------------------------\n';

        items.forEach(item => {
            let line = `${item.quantity}x ${item.name}`;
            if (item.variation) {
                line += ` (${item.variation})`;
            }
            receipt += this.bold(true);
            receipt += line + '\n';
            receipt += this.bold(false);
        });

        receipt += '--------------------------------\n';
        receipt += this.bold(true);
        receipt += `TOTAL ITEMS: ${items.length}\n`;
        receipt += this.bold(false);
        receipt += '================================\n';
        receipt += '\n\n\n';
        receipt += this.cut();

        return receipt;
    }

    // Send data to printer via network
    async sendToPrinter(ip, port, data) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            
            client.connect(port, ip, () => {
                console.log(`✅ Connected to printer at ${ip}:${port}`);
                client.write(data, 'binary');
            });

            client.on('data', (data) => {
                console.log('📄 Printer response:', data.toString());
                client.destroy();
            });

            client.on('close', () => {
                console.log('✅ Print job sent successfully');
                resolve(true);
            });

            client.on('error', (err) => {
                console.error('❌ Printer error:', err.message);
                reject(err);
            });

            // Timeout after 5 seconds
            setTimeout(() => {
                client.destroy();
                console.log('⚠️ Print timeout - but job likely sent');
                resolve(true);
            }, 5000);
        });
    }

    // Print combined receipt (for pending orders)
    async printCombined(order) {
        try {
            const receipt = this.generateCombinedReceipt(order);
            
            console.log('\n🖨️ PRINTING COMBINED REVIEW RECEIPT:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(receipt.replace(/[\x00-\x1F\x7F-\x9F]/g, ''));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Send to upper printer (could send to either one)
            await this.sendToPrinter(this.upperPrinterIP, this.printerPort, receipt);
            console.log('✅ Combined receipt printed!\n');
            return true;
        } catch (error) {
            console.error('❌ Print combined error:', error);
            return false;
        }
    }

    // Print to upper kitchen
    async printUpper(order) {
        try {
            const receipt = this.generateKitchenReceipt(order, 'upper');
            
            if (!receipt) {
                console.log('⚠️ No upper kitchen items to print');
                return true;
            }

            console.log('\n🍳 PRINTING UPPER KITCHEN RECEIPT:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(receipt.replace(/[\x00-\x1F\x7F-\x9F]/g, ''));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            await this.sendToPrinter(this.upperPrinterIP, this.printerPort, receipt);
            console.log('✅ Upper kitchen receipt printed!\n');
            return true;
        } catch (error) {
            console.error('❌ Upper printer error:', error);
            return false;
        }
    }

    // Print to lower kitchen
    async printLower(order) {
        try {
            const receipt = this.generateKitchenReceipt(order, 'lower');
            
            if (!receipt) {
                console.log('⚠️ No lower kitchen items to print');
                return true;
            }

            console.log('\n🍜 PRINTING LOWER KITCHEN RECEIPT:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(receipt.replace(/[\x00-\x1F\x7F-\x9F]/g, ''));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            await this.sendToPrinter(this.lowerPrinterIP, this.printerPort, receipt);
            console.log('✅ Lower kitchen receipt printed!\n');
            return true;
        } catch (error) {
            console.error('❌ Lower printer error:', error);
            return false;
        }
    }

    // Print to both kitchens (split receipts)
    async printBoth(order) {
        const upperItems = order.items.filter(item => item.station === 'upper');
        const lowerItems = order.items.filter(item => item.station === 'lower');

        const results = [];

        if (upperItems.length > 0) {
            results.push(await this.printUpper(order));
        }

        if (lowerItems.length > 0) {
            // Small delay between prints
            await new Promise(resolve => setTimeout(resolve, 1000));
            results.push(await this.printLower(order));
        }

        return results.length > 0 ? results.every(r => r === true) : false;
    }
}

module.exports = new KitchenPrinter();
