const fs = require('fs');

let code = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

const mockArrays = [
  "pendingRequests",
  "completedRequests",
  "departmentCompletedRequests",
  "departmentPendingRequests",
  "dataAccessCompletedRequests",
  "dataAccessPendingRequests",
  "dataAccessForwardedRequests",
  "spatialAccessPendingRequests",
  "spatialAccessCompletedRequests",
  "userAccessSubPendingRequests",
  "userAccessSubCompletedRequests",
  "dataDownloadPendingRequests",
  "dataDownloadCompletedRequests",
  "dataDownloadForwardedRequests",
  "metadataPendingRequests",
  "metadataCompletedRequests"
];

// 1. Rename global declarations
mockArrays.forEach(arr => {
  code = code.replace(new RegExp(`const ${arr} = \\[`, 'g'), `const RAW_${arr} = [`);
});
code = code.replace(/const userRequestGroups = \[/g, 'const RAW_userRequestGroups = [');

// 2. Remove the appUsers components from inside the function and move to top
const appUsersRegex = /const appUsersPendingRequests = \[[\s\S]*?\];\s*const appUsersCompletedRequests = \[[\s\S]*?\];/m;
const match = code.match(appUsersRegex);
if(match) {
  code = code.replace(match[0], '');
  // Insert at the top near other mock arrays
  let modifiedAppUsers = match[0].replace('const appUsersPendingRequests', 'const RAW_appUsersPendingRequests')
                                 .replace('const appUsersCompletedRequests', 'const RAW_appUsersCompletedRequests');
  code = code.replace(/const RAW_metadataCompletedRequests = \[[\s\S]*?\];/, match => match + '\n\n' + modifiedAppUsers);
  mockArrays.push("appUsersPendingRequests", "appUsersCompletedRequests");
}

// 3. Inject the RBAC Engine inside the function
const rbacEngine = `  const isSuperAdmin = location.pathname.includes("/super-admin");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const isReviewer = location.pathname.includes("/reviewer");
  const adminName = "Jawaher Rashed";
  const adminOrg = "BSDI";
  const adminDept = "GIS Department";

  const applyRbacFilter = (requests: any[]) => {
    if (!requests || !Array.isArray(requests)) return [];
    if (isSuperAdmin) return requests;
    
    if (isReviewer) {
      return requests.filter(req => {
        const ownerMatch = req.dataOwners?.includes(adminName) || (Array.isArray(req.dataOwners) && req.dataOwners.includes(adminName));
        const approverMatch = req.approvedBy === adminName || req.approver === adminName || req.reviewer === adminName;
        return ownerMatch || approverMatch;
      });
    }

    if (isDeptAdmin) {
      return requests.filter(req => {
        const deptStr = (req.orgDept || req.department || req.organizationDept || req.permissionDept || "").toLowerCase();
        const deptMatch = deptStr.includes(adminDept.toLowerCase());
        const submitterMatch = req.submittedBy === adminName || req.requestor === adminName || req.requestedBy === adminName;
        const ownerMatch = req.dataOwners?.includes(adminName) || req.approvedBy === adminName || req.approver === adminName;
        return deptMatch || submitterMatch || ownerMatch;
      });
    }

    // Default: isOrgAdmin or Organization User
    return requests.filter(req => {
      const orgStr = (req.organization || req.entity || req.orgDept || req.organizationDept || "").toLowerCase();
      const orgMatch = orgStr.includes(adminOrg.toLowerCase());
      const submitterMatch = req.submittedBy === adminName || req.requestor === adminName || req.requestedBy === adminName;
      const ownerMatch = req.dataOwners?.includes(adminName) || req.approvedBy === adminName || req.approver === adminName;
      return orgMatch || submitterMatch || ownerMatch;
    });
  };

  const applyGroupsRbacFilter = (groups: any[]) => {
    if (!groups || !Array.isArray(groups)) return [];
    if (isSuperAdmin) return groups;
    if (isOrgAdmin) {
      return groups.filter(g => g.users?.some((u: any) => (u.organization || "").toLowerCase() === adminOrg.toLowerCase()) || true); // Assuming submitter is always matched
    }
    return groups;
  };

${mockArrays.map(arr => `  const ${arr} = applyRbacFilter(RAW_${arr});`).join('\n')}
  const userRequestGroups = applyGroupsRbacFilter(RAW_userRequestGroups);

  const filteredUserRequestPendingGroups = userRequestGroups.filter(g => g.status === "pending");
  const filteredUserRequestCompletedGroups = userRequestGroups.filter(g => g.status === "completed");

  const totalPending = filteredUserRequestPendingGroups.length + departmentPendingRequests.length;
  const totalApproved = completedRequests.length + filteredUserRequestCompletedGroups.length + departmentCompletedRequests.length;
`;

const functionStart = "export default function DataAccessRequests1() {";
const splitContent = code.split(functionStart);
let componentBody = splitContent[1]

// Remove original bindings that conflict with new logic
const oldLogicStart = componentBody.indexOf("const location = useLocation();");
const oldLogicEnd = componentBody.indexOf("// Helper for request status visualization");
if(oldLogicStart !== -1 && oldLogicEnd !== -1) {
  const hooks = `  const location = useLocation();\n  const navigate = useNavigate();\n`;
  componentBody = componentBody.substring(0, oldLogicStart) + hooks + "\n" + rbacEngine + "\n" + componentBody.substring(oldLogicEnd);
}

fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', splitContent[0] + functionStart + componentBody, 'utf8');
console.log("RBAC patching complete.");
