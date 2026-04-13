const fs = require('fs');
const lines = fs.readFileSync("c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/DataAccessRequests.tsx", "utf8").split('\n');
lines.forEach((l, i) => {
  if (l.includes('pendingRequests.map') || l.includes('completedRequests.map')) {
    for (let j = i; j < i + 15; j++) {
      if (lines[j].includes('<tr') || lines[j].includes('className=')) {
        console.log(`${j+1}: ${lines[j].trim()}`);
      }
    }
  }
});
