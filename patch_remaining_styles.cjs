const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let c = fs.readFileSync(file, 'utf8');

// Apply the 36px height, rounded-10px to ALL primary/secondary buttons inside all Dialogs.
// We'll run regex on the whole document.

// Old Green Buttons -> New Green Buttons
c = c.replace(
  /w-full bg-gradient-to-r from-\[#00A651\].*?h-12.*?transition-all duration-300/g,
  'w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0 shadow-sm'
);

// Old Cancel Buttons -> New Cancel Buttons
c = c.replace(
  /w-full border-\[#E0E0E0\] rounded-xl h-12 text-\[#252628\] hover:bg-gray-50/g,
  'w-full bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm'
);

// Old Red Rejection Button -> New Red Rejection Button
c = c.replace(
  /w-full bg-gradient-to-r from-\[#FF4B4B\].*?h-12.*?transition-all duration-300/g,
  'w-full bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0 shadow-sm'
);

// Any other h-12 or h-11 dialog buttons
c = c.replace(/rounded-xl h-12/g, 'rounded-[10px] h-[36px]');
c = c.replace(/rounded-lg h-11/g, 'rounded-[10px] h-[36px]');

const documentViewerStr = 'Document Viewer';
if (c.includes(documentViewerStr)) {
  console.log('Document Viewer is still there.');
}

fs.writeFileSync(file, c, 'utf8');
console.log('Cleaned up remaining dialog button styles globally.');
