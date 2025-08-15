const fs = require('fs');
const path = require('path');

// Function to parse headers, handling complex multi-line headers
function parseHeaders(lines) {
    // The first line contains the main headers, but we need to handle the multi-line structure
    // Skip the first line and use predefined headers based on the CSV structure
    const expectedHeaders = [
        'PROPERTY_ADDRESS',
        'PROJECT', 
        'POSTAL',
        'TYPE_OF_PROPERTY',
        'DISTRICT',
        'LM_LS_1',
        'LM_LS_2',
        'LM_LS_3',
        'TRANSACTION_TYPE',
        'OPTION_DATE',
        'EXERCISED_DATE',
        'SOLD_DURATION_FROM_PORTAL_LAUNCH_OPTIONED',
        'SOLD_DURATION_FROM_PORTAL_LAUNCH_EXERCISED',
        'TRANSACTED_PRICE'
    ];
    
    return expectedHeaders;
}

// Function to convert CSV to JSON
function csvToJson(csvFilePath, outputFilePath) {
    try {
        // Read the CSV file
        const csvContent = fs.readFileSync(csvFilePath, 'utf8');
        
        // Split into lines and remove empty lines
        const lines = csvContent.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 3) {
            throw new Error('CSV file must have at least header rows and one data row');
        }
        
        // Parse headers - handle the complex header structure
        const headers = parseHeaders(lines);
        
        // Parse data rows - skip the first 2 lines (header lines)
        const jsonData = [];
        
        for (let i = 3; i < lines.length; i++) {
            const line = lines[i];
            const rowData = parseRow(line, headers);
            if (rowData && Object.keys(rowData).length > 0) {
                jsonData.push(rowData);
            }
        }
        
        // Write JSON to output file
        const outputDir = path.dirname(outputFilePath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
        
        console.log(`✅ Successfully converted CSV to JSON!`);
        console.log(`📊 Input: ${csvFilePath}`);
        console.log(`📄 Output: ${outputFilePath}`);
        console.log(`📈 Records processed: ${jsonData.length}`);
        
        return jsonData;
        
    } catch (error) {
        console.error('❌ Error converting CSV to JSON:', error.message);
        throw error;
    }
}

// Function to parse a single row
function parseRow(line, headers) {
    try {
        // Split the line by comma, but handle quoted fields properly
        const values = parseCSVLine(line);
        
        // Create row data object
        const rowData = {};
        
        // Map values to headers, handling cases where there might be fewer values
        headers.forEach((header, index) => {
            let value = values[index] || '';
            
            // Clean up the value
            value = value.trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Handle empty values
            if (value === '' || value === '-') {
                value = null;
            }
            
            // Try to parse numbers for price fields
            if (header === 'TRANSACTED_PRICE' && value) {
                const numValue = parseFloat(value.replace(/[$,]/g, ''));
                if (!isNaN(numValue)) {
                    value = numValue;
                }
            }
            
            rowData[header] = value;
        });
        
        return rowData;
        
    } catch (error) {
        console.warn(`⚠️  Error parsing row: ${error.message}`);
        return null;
    }
}

// Function to properly parse CSV line with quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
        
        i++;
    }
    
    result.push(current);
    return result;
}

// Main execution
if (require.main === module) {
    const csvFilePath = path.join(__dirname, '../public/2025_transactions.csv');
    const outputFilePath = path.join(__dirname, '../public/2025_transactions.json');
    
    try {
        csvToJson(csvFilePath, outputFilePath);
    } catch (error) {
        process.exit(1);
    }
}

module.exports = { csvToJson }; 