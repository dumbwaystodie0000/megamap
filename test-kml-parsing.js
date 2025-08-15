// Test script to verify KML parsing functionality
const fs = require('fs');
const { DOMParser } = require('xmldom');

// Mock the KML parsing function
function parseKMLData(kmlText) {
  try {
    console.log('Starting KML parsing...');
    console.log('KML text length:', kmlText.length);
    console.log('KML text preview:', kmlText.substring(0, 200));
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
    
    const placemarks = xmlDoc.getElementsByTagName('Placemark');
    console.log('Found placemarks:', placemarks.length);
    const schools = [];
    
    for (let i = 0; i < placemarks.length; i++) {
      const placemark = placemarks[i];
      const nameElement = placemark.getElementsByTagName('name')[0];
      const descriptionElement = placemark.getElementsByTagName('description')[0];
      const coordinatesElement = placemark.getElementsByTagName('coordinates')[0];
      const extendedData = placemark.getElementsByTagName('ExtendedData')[0];
      
      if (i < 3) { // Debug first 3 placemarks
        console.log(`Placemark ${i}:`, {
          name: nameElement?.textContent?.trim(),
          coords: coordinatesElement?.textContent?.trim(),
          hasExtendedData: !!extendedData
        });
      }
      
      if (nameElement && descriptionElement && coordinatesElement && extendedData) {
        const name = nameElement.textContent?.trim() || '';
        
        // Extract coordinates
        const coordsText = coordinatesElement.textContent?.trim() || '';
        const coords = coordsText.split(',').map(Number);
        if (i < 3) { // Debug first 3 coordinates
          console.log(`Coordinates for ${name}:`, { coordsText, coords, lng: coords[0], lat: coords[1] });
        }
        if (coords.length >= 2) {
          const [lng, lat] = coords;
          
          // Extract school type from ExtendedData
          let schoolType = 'PRIMARY';
          const mainlevelData = extendedData.getElementsByTagName('Data').length > 0 ? 
            Array.from(extendedData.getElementsByTagName('Data')).find(el => el.getAttribute('name') === 'mainlevel_code') : null;
          if (mainlevelData) {
            const valueElement = mainlevelData.getElementsByTagName('value')[0];
            if (valueElement) {
              const type = valueElement.textContent?.trim();
              if (type === 'SECONDARY' || type === 'JUNIOR COLLEGE' || type === 'MIXED LEVELS') {
                schoolType = type;
              }
            }
          }
          
          // Extract postal code
          let postalCode = '';
          const postalData = extendedData.getElementsByTagName('Data').length > 0 ? 
            Array.from(extendedData.getElementsByTagName('Data')).find(el => el.getAttribute('name') === 'postal_code') : null;
          if (postalData) {
            const valueElement = postalData.getElementsByTagName('value')[0];
            if (valueElement) {
              postalCode = valueElement.textContent?.trim() || '';
            }
          }
          
          schools.push({
            name,
            coordinates: [lat, lng], // KML format is lng,lat,altitude, so we need [lat, lng] for Leaflet
            type: schoolType,
            postalCode
          });
        }
      }
    }
    
    console.log(`Parsed ${schools.length} schools from KML file`);
    console.log('Sample schools:', schools.slice(0, 3));
    return schools;
  } catch (error) {
    console.error('Error parsing KML data:', error);
    return [];
  }
}

// Read the KML file
try {
  const kmlText = fs.readFileSync('public/school-map.kml', 'utf8');
  const schools = parseKMLData(kmlText);
  console.log('Successfully parsed KML file!');
  console.log(`Total schools found: ${schools.length}`);
} catch (error) {
  console.error('Error reading KML file:', error);
} 