const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Add TabsTrigger
const triggerOriginal = '<TabsTrigger value="data-download" className="tab-item">Data Download</TabsTrigger>';
const newTrigger = '<TabsTrigger value="metadata" className="tab-item">Metadata</TabsTrigger>';
if (!content.includes(newTrigger)) {
    content = content.replace(triggerOriginal, triggerOriginal + '\n                ' + newTrigger);
}

// 2. Inject state variables
const stateVars = `
  const [metadataPendingSearch, setMetadataPendingSearch] = useState("");
  const [metadataPendingDateRange, setMetadataPendingDateRange] = useState({from:'', to:''});
  const [metadataForwardedSearch, setMetadataForwardedSearch] = useState("");
  const [metadataForwardedDateRange, setMetadataForwardedDateRange] = useState({from:'', to:''});
  const [metadataCompletedSearch, setMetadataCompletedSearch] = useState("");
  const [metadataCompletedDateRange, setMetadataCompletedDateRange] = useState({from:'', to:''});
`;
if (!content.includes('metadataPendingSearch')) {
    content = content.replace('  const [deptPendingSearch, setDeptPendingSearch] = useState("");', '  const [deptPendingSearch, setDeptPendingSearch] = useState("");\n' + stateVars);
}

// 3. Duplicate TabsContent block
const tabStartStr = '<TabsContent value="data-download">';
const tabStart = content.indexOf(tabStartStr);

if (tabStart !== -1) {
    const afterTab = content.substring(tabStart);
    // Find matching ending tag for TabsContent. We assume it's the next </TabsContent>
    const tabEndStr = '</TabsContent>';
    const tabEnd = afterTab.indexOf(tabEndStr) + tabEndStr.length;
    
    if (tabEnd !== -1) {
        let block = afterTab.substring(0, tabEnd);
        
        // Transform block
        block = block.replace(/value="data-download"/g, 'value="metadata"');
        block = block.replace(/data-download-forwarded/g, 'metadata-forwarded');
        block = block.replace(/Data Download/g, 'Metadata');
        
        // Isolate State Variables
        block = block.replace(/deptPendingSearch/g, 'metadataPendingSearch');
        block = block.replace(/deptPendingDateRange/g, 'metadataPendingDateRange');
        block = block.replace(/setDeptPendingSearch/g, 'setMetadataPendingSearch');
        block = block.replace(/setDeptPendingDateRange/g, 'setMetadataPendingDateRange');
        
        block = block.replace(/dataDownloadForwardedSearch/g, 'metadataForwardedSearch');
        block = block.replace(/dataDownloadForwardedDateRange/g, 'metadataForwardedDateRange');
        block = block.replace(/setDataDownloadForwardedSearch/g, 'setMetadataForwardedSearch');
        block = block.replace(/setDataDownloadForwardedDateRange/g, 'setMetadataForwardedDateRange');
        
        block = block.replace(/orgCompletedSearch/g, 'metadataCompletedSearch');
        block = block.replace(/orgCompletedDateRange/g, 'metadataCompletedDateRange');
        block = block.replace(/setOrgCompletedSearch/g, 'setMetadataCompletedSearch');
        block = block.replace(/setOrgCompletedDateRange/g, 'setMetadataCompletedDateRange');
        
        // Wait, accordions use openAccordion value. 
        // We'll change the openAccordion strings to prevent collision
        block = block.replace(/'dept-pending'/g, "'metadata-pending'");
        block = block.replace(/value="dept-pending"/g, 'value="metadata-pending"');
        
        block = block.replace(/'org-completed'/g, "'metadata-completed'");
        block = block.replace(/value="org-completed"/g, 'value="metadata-completed"');
        
        // Insert after the original block
        const absStart = tabStart;
        const absEnd = tabStart + tabEnd;
        
        content = content.substring(0, absEnd) + '\n\n            {/* Metadata Tab */}\n            ' + block + content.substring(absEnd);
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('✅ Duplicated Data Download tab to Metadata successfully.');
    } else {
        console.log('❌ Could not find end of Data Download tab.');
    }
} else {
    console.log('❌ Could not find Data Download tab.');
}
