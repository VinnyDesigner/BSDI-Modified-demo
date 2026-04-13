const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let content = fs.readFileSync(file, 'utf8');

// The hacky 'typeof request !== "undefined"' might cause TS errors. Let's make it scoped.
// Let's replace 'typeof request !== "undefined" ? request.id : group.id' with safe object lookup.
// Wait, actually, let's just use 'request.id' where we can find 'request', and 'group.id' where we can find 'group'.
// Since we used regex globally on the file, let's revert and do it properly, OR just replace 'typeof request !== "undefined" ? request.id : group.id' with '((typeof request !== "undefined" ? (request as any).id : (typeof group !== "undefined" ? (group as any).id : "Unknown")))'
// actually even `typeof request` makes TS complain if `request` isn't declared.
// A simpler TS-safe cast is using the global window object? No.

// Let's replace the previous hookup.
content = content.replace(/typeof request !== "undefined" \? request\.id : group\.id/g, '((globalThis as any).request ? (globalThis as any).request.id : ((typeof request !== "undefined" ? (request as any).id : (typeof group !== "undefined" ? (group as any).id : ""))))');
// Nevermind, let's just do an AST safe context string match.

const target = `typeof request !== "undefined" ? request.id : group.id`;

// For departmentPendingRequests block, it uses `request`. For userRequestGroupsList, it uses `group`.
// In JavaScript, we can just replace the whole onClick to avoid TS issues if we find the exact context block.
content = content.replace(/departmentPendingRequests\.map\(\s*\(request, idx\) => \{[\s\S]*?typeof request !== "undefined" \? request\.id : group\.id[\s\S]*?\}\)/g, (match) => {
    return match.replace(/typeof request !== "undefined" \? request\.id : group\.id/g, 'request.id');
});

content = content.replace(/userRequestGroupsList\.map\(\s*\(group, groupIdx\) => \{[\s\S]*?typeof request !== "undefined" \? request\.id : group\.id[\s\S]*?\}\)/g, (match) => {
    return match.replace(/typeof request !== "undefined" \? request\.id : group\.id/g, 'group.id');
});

// For pendingRequests.map
content = content.replace(/pendingRequests\.map\(\s*\(request, idx\) => \{[\s\S]*?typeof request !== "undefined" \? request\.id : group\.id[\s\S]*?\}\)/g, (match) => {
    return match.replace(/typeof request !== "undefined" \? request\.id : group\.id/g, 'request.id');
});

// Any stragglers
content = content.replace(/typeof request !== "undefined" \? request\.id : group\.id/g, '((request as any)?.id || (group as any)?.id || "unknown")');

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed TS scope issues.");
