const fs = require('fs'); 
let lines = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8').split(/\r?\n/); 
const startIdx = lines.findIndex(l => l.includes('const metadataCompletedRequests = [')); 
const endIdx = lines.findIndex(l => l.includes('const filteredCompletedRequests = getFilteredRequests(completedRequests);')); 
if (startIdx !== -1 && endIdx !== -1) { 
  const newContent = `const metadataCompletedRequests = [
  { 
    id: "META-2043-907", 
    layerName: "Land Use 2023",
    layerType: "Polygon",
    requestor: "Yusuf Al-Doseri",
    requestedDate: "3 days ago", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  },
  { 
    id: "META-2043-903", 
    layerName: "Road Centerlines",
    layerType: "Line",
    requestor: "Sara Mohammad",
    requestedDate: "6 days ago", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  }
];

export default function DataAccessRequests1() {
  const [appUsersPendingSearch, setAppUsersPendingSearch] = useState("");
  const [appUsersPendingDateRange, setAppUsersPendingDateRange] = useState({from:'', to:''});
  const [appUsersCompletedSearch, setAppUsersCompletedSearch] = useState("");
  const [appUsersCompletedDateRange, setAppUsersCompletedDateRange] = useState({from:'', to:''});

  const appUsersPendingRequests = [
    { id: "APP-3042-125", name: "Ahmed Al-Mansouri", email: "ahmed.mansouria@gov.bh", orgDept: "Ministry of Works (GIS Department)", role: "GIS Analyst", requestedDate: "18 Mar 2025", requestedBy: "Lulwa Saad Mujaddam" },
    { id: "APP-3042-124", name: "Fatima Al-Khalifa", email: "fatima.khalifa@gov.bh", orgDept: "Transport Authority (Data Management)", role: "Data Reviewer", requestedDate: "17 Mar 2025", requestedBy: "Rana A. Majeed" }
  ];

  const appUsersCompletedRequests = [
    { id: "APP-3042-123", name: "Mohammed Al-Baker", email: "mohammed.baker@gov.bh", orgDept: "Urban Planning Authority (Planning Department)", role: "Department Admin", requestedDate: "15 Mar 2025", approvedDate: "20 Mar 2025", approver: "—", requester: "—", status: "Approved" },
    { id: "APP-3042-122", name: "—", email: "", orgDept: "Environmental Agency (Data Services)", role: "Organization User", requestedDate: "14 Mar 2025", approvedDate: "19 Mar 2025", approver: "Yousif Al-Mahmood", requester: "Ahmed Al-Harqani", status: "Approved" }
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const adminName = "Jawaher Rashed";
  const adminOrg = "BSDI";

  // RBAC Filtering Logic
  const getFilteredRequests = (requests: any[]) => {
    if (!isOrgAdmin) return requests;
    return requests.filter(req => {
      const orgMatch = req.organization === adminOrg;
      const submitterMatch = (req.submittedBy === adminName) || (req.requestor === adminName);
      const ownerMatch = req.dataOwners?.includes(adminName);
      return orgMatch || submitterMatch || ownerMatch;
    });
  };

  // Filtered Lists for Org Admin
  const filteredCompletedRequests = getFilteredRequests(completedRequests);`.split('\n'); 
  lines.splice(startIdx, endIdx - startIdx + 1, ...newContent); 
  fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', lines.join('\n')); 
  console.log('Successfully repaired file.'); 
} else { 
  console.log('Could not find start/end bounds:', startIdx, endIdx); 
}
