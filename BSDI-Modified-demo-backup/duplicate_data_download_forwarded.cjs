const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Add state variables for 'Forwarded' accordion
const stateVarsStr = `  const [dataDownloadForwardedSearch, setDataDownloadForwardedSearch] = useState("");
  const [dataDownloadForwardedDateRange, setDataDownloadForwardedDateRange] = useState({from:'', to:''});\n`;

if (!content.includes('const [dataDownloadForwardedSearch')) {
    content = content.replace('  const [deptPendingSearch, setDeptPendingSearch] = useState("");', '  const [deptPendingSearch, setDeptPendingSearch] = useState("");\n' + stateVarsStr);
}

// 2. Duplicate the pending accordion in data-download tab
const tabStart = content.indexOf('<TabsContent value="data-download">');
if (tabStart !== -1) {
    const afterTab = content.substring(tabStart);
    const pendingStart = afterTab.indexOf('<AccordionItem');
    // Note: The pending accordion item value is "dept-pending".
    // We want to find the END of this AccordionItem.
    const pendingEndStr = '</AccordionItem>';
    const pendingEnd = afterTab.indexOf(pendingEndStr, pendingStart) + pendingEndStr.length;
    
    if (pendingStart !== -1 && pendingEnd !== -1) {
        const pendingBlock = afterTab.substring(pendingStart, pendingEnd);
        
        // Transform the duplicated block for "Forwarded"
        let forwardedBlock = pendingBlock;
        forwardedBlock = forwardedBlock.replace(/value="dept-pending"/g, 'value="data-download-forwarded"');
        forwardedBlock = forwardedBlock.replace(/{openAccordion === 'dept-pending' \? 'bg-\[#FEF2F2\]' : 'bg-white'}/g, "{openAccordion === 'data-download-forwarded' ? 'bg-[#FFFBEB]' : 'bg-white'}");
        // Dot Color to yellow/orange
        forwardedBlock = forwardedBlock.replace(/bg-\[#EF4444\] rounded-full shadow-\[0_0_8px_rgba\(239,68,68,0\.5\)\]/g, 'bg-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]');
        forwardedBlock = forwardedBlock.replace(/>Pending</g, '>Forwarded<');
        
        // Search inputs
        forwardedBlock = forwardedBlock.replace(/Search pending requests/g, 'Search forwarded requests');
        forwardedBlock = forwardedBlock.replace(/focus:ring-\[#EF4444\]/g, 'focus:ring-[#F59E0B]');
        forwardedBlock = forwardedBlock.replace(/deptPendingSearch/g, 'dataDownloadForwardedSearch');
        forwardedBlock = forwardedBlock.replace(/deptPendingDateRange/g, 'dataDownloadForwardedDateRange');
        forwardedBlock = forwardedBlock.replace(/setDeptPendingSearch/g, 'setDataDownloadForwardedSearch');
        forwardedBlock = forwardedBlock.replace(/setDeptPendingDateRange/g, 'setDataDownloadForwardedDateRange');
        
        // Replace map variable in TooltipProvider
        forwardedBlock = forwardedBlock.replace(/dataDownloadPendingRequests/g, 'dataDownloadPendingRequests'); 
        // We reuse the pending requests mock data as requested
        
        const absStart = tabStart + pendingStart;
        const absEnd = tabStart + pendingEnd;
        
        // Insert the duplicated block RIGHT AFTER the pending block
        content = content.substring(0, absEnd) + '\n                ' + forwardedBlock + content.substring(absEnd);
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('✅ Duplicated Pending accordion to Forwarded inside data-download.');
    } else {
        console.log('❌ Could not find AccordionItem inside data-download tab.');
    }
} else {
    console.log('❌ Could not find data-download tab.');
}
