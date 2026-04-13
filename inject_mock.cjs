const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let c = fs.readFileSync(file, 'utf8');

const mockDataString = `
// Mock data for Data Access Pending Requests
const dataAccessPendingRequests = [
  { id: "DAE-3042-893", service: "Road Network - WMS", entity: "Transport Authority", requester: "Sara Mohammad", date: "12 Jan 2025" },
  { id: "DAE-3042-894", service: "Building Footprints - WFS", entity: "Min. of Municipalities", requester: "Ahmed Al-Harqani", date: "12 Jan 2025" }
];
`;

if (!c.includes('const dataAccessPendingRequests')) {
  // Inject right before component definition
  c = c.replace('export default function DataAccessRequests1() {', mockDataString + '\nexport default function DataAccessRequests1() {');
  fs.writeFileSync(file, c, 'utf8');
  console.log('Successfully injected dataAccessPendingRequests');
} else {
  console.log('dataAccessPendingRequests already present');
}
