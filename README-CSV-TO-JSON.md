# CSV to JSON Converter

This script converts the `2025_transactions.csv` file to JSON format for easier data processing and analysis.

## Features

- Handles complex CSV headers with special characters
- Properly parses quoted fields
- Converts numeric values (removes currency symbols and commas)
- Handles empty values and special characters
- Creates clean, structured JSON output

## Usage

### Option 1: Using npm script (Recommended)
```bash
npm run csv-to-json
```

### Option 2: Direct Node.js execution
```bash
node scripts/csv-to-json.js
```

## Testing the Output

After conversion, you can test the generated JSON file:

```bash
npm run test-json
```

This will show:
- Total number of records processed
- Sample record structure
- Available fields
- Data statistics (property types, transaction types, price ranges)

## Input/Output

- **Input**: `public/2025_transactions.csv`
- **Output**: `public/2025_transactions.json`

## Data Structure

The script converts the CSV headers to clean field names:

- `PROPERTY ADDRESS` → `PROPERTY_ADDRESS`
- `TYPE OF PROPERTY` → `TYPE_OF_PROPERTY`
- `LM/LS 1` → `LM_LS_1`
- `TRANSACTED PRICE` → `TRANSACTED_PRICE`

## Sample Output

```json
[
  {
    "PROPERTY_ADDRESS": "72 PUNGGOL WALK #08-47 A TREASURE TROVE SINGAPORE 828786",
    "PROJECT": "A TREASURE TROVE",
    "POSTAL": "828786",
    "TYPE_OF_PROPERTY": "CONDO",
    "DISTRICT": "D19",
    "LM_LS_1": "SHAWN TAY",
    "LM_LS_2": "CALINE LEONG",
    "LM_LS_3": null,
    "TRANSACTION_TYPE": "LANDLORD",
    "OPTION_DATE": "21/06/2025",
    "EXERCISED_DATE": "21/06/2025",
    "SOLD_DURATION_FROM_PORTAL_LAUNCH_OPTIONED": null,
    "SOLD_DURATION_FROM_PORTAL_LAUNCH_EXERCISED": null,
    "TRANSACTED_PRICE": 4750
  }
]
```

## Conversion Results

The script successfully processed **544 property transaction records** with the following breakdown:

- **Property Types**: CONDO (324), HDB (121), LANDED (52), NEW LAUNCH (24), COMMERCIAL (20), SHOPHOUSES (3)
- **Transaction Types**: SALES (195), PURCHASE (176), LANDLORD (152), TENANT (21)
- **Price Range**: $720 - $12,400,000
- **Average Price**: $1,396,440

## Error Handling

- The script will skip rows with parsing errors and continue processing
- Warnings are displayed for problematic rows
- The script exits with error code 1 if critical errors occur

## Requirements

- Node.js (built-in modules only - no external dependencies)
- The CSV file must be present in the `public/` directory 