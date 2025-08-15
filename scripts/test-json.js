const fs = require('fs');
const path = require('path');

// Test the generated JSON file
function testJsonFile() {
    try {
        const jsonFilePath = path.join(__dirname, '../public/2025_transactions.json');
        
        if (!fs.existsSync(jsonFilePath)) {
            console.error('❌ JSON file not found. Run the CSV to JSON conversion first.');
            return;
        }
        
        // Read and parse the JSON file
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        const data = JSON.parse(jsonContent);
        
        console.log('✅ JSON file loaded successfully!');
        console.log(`📊 Total records: ${data.length}`);
        
        if (data.length > 0) {
            const firstRecord = data[0];
            console.log('\n📋 Sample record structure:');
            console.log(JSON.stringify(firstRecord, null, 2));
            
            // Show field names
            console.log('\n🏷️  Available fields:');
            Object.keys(firstRecord).forEach(field => {
                console.log(`  - ${field}`);
            });
            
            // Show some statistics
            console.log('\n📈 Data statistics:');
            
            // Count by property type
            const propertyTypes = {};
            data.forEach(record => {
                const type = record.TYPE_OF_PROPERTY || 'Unknown';
                propertyTypes[type] = (propertyTypes[type] || 0) + 1;
            });
            
            console.log('Property types:');
            Object.entries(propertyTypes).forEach(([type, count]) => {
                console.log(`  ${type}: ${count}`);
            });
            
            // Count by transaction type
            const transactionTypes = {};
            data.forEach(record => {
                const type = record.TRANSACTION_TYPE || 'Unknown';
                transactionTypes[type] = (transactionTypes[type] || 0) + 1;
            });
            
            console.log('\nTransaction types:');
            Object.entries(transactionTypes).forEach(([type, count]) => {
                console.log(`  ${type}: ${count}`);
            });
            
            // Price statistics
            const prices = data
                .map(record => record.TRANSACTED_PRICE)
                .filter(price => price !== null && !isNaN(price));
            
            if (prices.length > 0) {
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
                
                console.log('\nPrice statistics:');
                console.log(`  Min: $${minPrice.toLocaleString()}`);
                console.log(`  Max: $${maxPrice.toLocaleString()}`);
                console.log(`  Average: $${Math.round(avgPrice).toLocaleString()}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing JSON file:', error.message);
    }
}

// Run the test
if (require.main === module) {
    testJsonFile();
}

module.exports = { testJsonFile }; 