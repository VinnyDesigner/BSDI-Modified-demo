const fs = require('fs');
let content = fs.readFileSync('src/app/routes.tsx', 'utf8');

// Function to remove a block starting with { and ending with }, including indentation
function removeBlock(path) {
    const regex = new RegExp(`\\s*{\\s*path:\\s*"${path}",[\\s\\S]*?},`, 'g');
    content = content.replace(regex, '');
}

const pathsToRemove = [
    "user/data-requests",
    "department/data-requests",
    "entity-admin/data-requests",
    "super-admin/data-requests",
    "reviewer/data-requests",
    "monitoring/data-requests"
];

pathsToRemove.forEach(removeBlock);

fs.writeFileSync('src/app/routes.tsx', content);
console.log('Successfully removed old routes.');
