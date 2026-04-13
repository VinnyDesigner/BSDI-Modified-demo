const fs = require('fs');
let code = fs.readFileSync('src/app/routes.tsx', 'utf8');

code = code.replace(/path:\s*"department\/data-requests",[\s\S]*?},/m, match => match + '\n      { \n        path: "department/data-requests1", \n        Component: DataAccessRequests1 \n      },');
code = code.replace(/path:\s*"reviewer\/data-requests",[\s\S]*?},/m, match => match + '\n      { \n        path: "reviewer/data-requests1", \n        Component: DataAccessRequests1 \n      },');

fs.writeFileSync('src/app/routes.tsx', code);
