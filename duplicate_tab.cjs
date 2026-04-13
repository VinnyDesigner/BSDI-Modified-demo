const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let c = fs.readFileSync(file, 'utf8');

const tabTriggerTarget = '<TabsTrigger value="user-request" className="tab-item">User Request</TabsTrigger>';
const tabTriggerReplacement = '<TabsTrigger value="user-request" className="tab-item">User Request</TabsTrigger>\n                <TabsTrigger value="data-access" className="tab-item">Data Access</TabsTrigger>';

if (c.includes(tabTriggerTarget)) {
  c = c.replace(tabTriggerTarget, tabTriggerReplacement);
  console.log('Added Data Access TabsTrigger');
} else {
  console.log('Failed to add Data Access TabsTrigger');
}

const deptStart = c.indexOf('<TabsContent value="department">');
const userStart = c.indexOf('<TabsContent value="user-request">');
const approveStart = c.indexOf('{/* ─── Approve Dialog ─── */}');

if (deptStart > -1 && userStart > -1 && approveStart > -1) {
  // Extract Department Block
  // Look for the last closing tag of the department block just before the user block starts.
  let deptBlock = c.substring(deptStart, userStart);
  
  // Create the new block
  let dataAccessBlock = deptBlock.replace('<TabsContent value="department">', '<TabsContent value="data-access">');
  dataAccessBlock = '\n            {/* Data Access Tab (Duplicated from Department) */}\n            ' + dataAccessBlock;
  
  // The insertion point is the close of the user-request block, which is right before the approveStart.
  // Actually, we want to insert right before `approveStart`. But we should be careful not to include trailing `</TabsContent>` of the overall `<Tabs>` wrapper? No, `<TabsContent>` holds the tab. The `approveStart` happens AFTER the `<TabsContent>` of user-request closes. Wait. Let's look at the structure.
  
  // Structure:
  // <Tabs>
  //   ...
  //   <TabsContent value="user-request"> ... </TabsContent>
  //   {/* ─── Approve Dialog ─── */}
  //   ...
  // </Tabs>
  // So inserting dataAccessBlock right after `</TabsContent>` of user-request means we can insert it right before `approveStart`.
  // Wait, let's look for the exact insertion point. The user request block closes with `</TabsContent>` then might be some whitespace, then `approveStart`.
  let insertIndex = c.lastIndexOf('</TabsContent>', approveStart);
  if (insertIndex > -1) {
    insertIndex += '</TabsContent>'.length; // right after it
    c = c.substring(0, insertIndex) + dataAccessBlock + c.substring(insertIndex);
    console.log('Data access block duplicated and inserted successfully.');
    fs.writeFileSync(file, c, 'utf8');
  } else {
    console.log('Could not find inserting point.');
  }
} else {
  console.log('Indices missing', deptStart, userStart, approveStart);
}
