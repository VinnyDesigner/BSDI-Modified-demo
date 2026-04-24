/**
 * Interface for the data required to populate the BSDI Portal Access Form.
 */
export interface AccessFormPrintData {
  requesterName: string;
  designation: string;
  contactNumber: string;
  emailId: string;
  ministryOrganization: string;
  users: Array<{
    cpr: string;
    name: string;
    contactNumber: string;
    email: string;
    designation: string;
    department: string;
    role: string;
  }>;
}

/**
 * Generates the full HTML for the BSDI Portal Access Form.
 * This template is pixel-perfect and isolated from the app's CSS.
 */
export const generateAccessFormHtml = (data: AccessFormPrintData): string => {
  // Generate rows for the user table
  const userRows = data.users
    .map(
      (user, index) => `
      <tr>
        <td style="text-align: center; border: 1px solid #333; padding: 8px;">${index + 1}</td>
        <td style="border: 1px solid #333; padding: 8px;">${user.cpr || ""}</td>
        <td style="border: 1px solid #333; padding: 8px;">${user.name || ""}</td>
        <td style="border: 1px solid #333; padding: 8px;">${user.contactNumber || ""}</td>
        <td style="border: 1px solid #333; padding: 8px;">${user.email || ""}</td>
        <td style="border: 1px solid #333; padding: 8px;">${user.designation || ""}</td>
        <td style="border: 1px solid #333; padding: 8px;">${user.department || ""}</td>
        <td style="border: 1px solid #333; padding: 8px;">${user.role || ""}</td>
      </tr>
    `
    )
    .join("");

  // Add empty rows to maintain form length (total 8 rows)
  const emptyRows = Array(Math.max(0, 8 - data.users.length))
    .fill(null)
    .map(
      () => `
      <tr>
        <td style="border: 1px solid #333; padding: 8px; height: 24px;"></td>
        <td style="border: 1px solid #333; padding: 8px;"></td>
        <td style="border: 1px solid #333; padding: 8px;"></td>
        <td style="border: 1px solid #333; padding: 8px;"></td>
        <td style="border: 1px solid #333; padding: 8px;"></td>
        <td style="border: 1px solid #333; padding: 8px;"></td>
        <td style="border: 1px solid #333; padding: 8px;"></td>
        <td style="border: 1px solid #333; padding: 8px;"></td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>BSDI Portal Access Form</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #f0f1f3;
      font-family: 'Source Sans 3', sans-serif;
      display: flex;
      justify-content: center;
      padding: 40px 0;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      background: white;
      padding: 20mm;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    /* HEADER */
    .header {
      display: grid;
      grid-template-columns: 140px 1fr 160px;
      align-items: center;
      border: 2px solid #333;
      margin-bottom: 30px;
    }
    .header-logo {
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .header-logo.left { border-right: 2px solid #333; }
    .header-logo.right { border-left: 2px solid #333; }
    .header-title {
      text-align: center;
      font-family: 'Libre Baskerville', serif;
      font-size: 26px;
      font-weight: 700;
      color: #333;
    }

    /* SECTION TITLE */
    .section-title {
      font-family: 'Libre Baskerville', serif;
      font-size: 18px;
      color: #004a99;
      text-decoration: underline;
      margin-bottom: 15px;
      font-weight: 700;
    }

    /* TABLES */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 13px;
    }
    .requester-table th, .requester-table td {
      border: 1px solid #333;
      padding: 10px;
      text-align: left;
    }
    .requester-table th {
      background: #d9e1f2;
      width: 200px;
      color: #000;
      font-weight: 700;
    }

    .user-table th {
      background: #d9e1f2;
      border: 1px solid #333;
      padding: 8px;
      text-align: center;
      font-weight: 700;
      text-transform: uppercase;
    }

    /* FOOTER */
    .footer {
      margin-top: auto;
      border: 2px solid #333;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      font-size: 12px;
    }
    .footer-col {
      padding: 10px;
      border-right: 2px solid #333;
    }
    .footer-col:last-child { border-right: none; }
    .footer-item { margin-bottom: 4px; font-weight: 700; }
    .val-red { color: #cc0000; }
    .val-blu { color: #004a99; }
    .footer-copy {
       text-align: right;
       margin-top: 15px;
       color: #004a99;
       font-style: italic;
    }

    @media print {
      body { background: none; padding: 0; }
      .page { box-shadow: none; padding: 10mm; }
      @page { size: A4; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-logo left">
        <img src="https://raw.githubusercontent.com/vinny-designer/images/main/iga-logo.png" style="max-width: 100%; max-height: 80px;" />
      </div>
      <div class="header-title">BSDI Portal Access Form</div>
      <div class="header-logo right">
        <!-- Replaced with a stable placeholder for Bureau Veritas logo -->
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Bureau_Veritas_Logo.svg/1200px-Bureau_Veritas_Logo.svg.png" style="max-width: 100%; max-height: 60px;" />
      </div>
    </div>

    <div class="section-title">Requester Information:</div>
    <table class="requester-table">
      <tr>
        <th>Name</th>
        <td>${data.requesterName || ""}</td>
      </tr>
      <tr>
        <th>Designation</th>
        <td>${data.designation || ""}</td>
      </tr>
      <tr>
        <th>Contact Number</th>
        <td>${data.contactNumber || ""}</td>
      </tr>
      <tr>
        <th>Email ID</th>
        <td>${data.emailId || ""}</td>
      </tr>
      <tr>
        <th>Ministry/Organisation</th>
        <td>${data.ministryOrganization || ""}</td>
      </tr>
    </table>

    <table class="user-table">
      <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th>CPR</th>
          <th>Name</th>
          <th>Contact Number</th>
          <th>Email</th>
          <th>Designation</th>
          <th>Department</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        ${userRows}
        ${emptyRows}
      </tbody>
    </table>

    <div class="footer">
      <div class="footer-col">
        <div class="footer-item">Record. Ref. #: <span class="val-red">CIO-GIS-R12-2346</span></div>
        <div class="footer-item">Directorate: <span class="val-blu">GIS</span></div>
        <div class="footer-item">Page 1 of 1</div>
      </div>
      <div class="footer-col">
        <div class="footer-item">Version: <span class="val-red">1.0</span></div>
        <div class="footer-item">Section: <span class="val-blu">GIS</span></div>
        <div class="footer-item">Author: </div>
      </div>
      <div class="footer-col">
        <div class="footer-item" style="text-align: right;">Date: <span class="val-red">16-08-2012</span></div>
        <div class="footer-copy">&copy; Central Informatics & Communications Organisation</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = () => {
      setTimeout(() => {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;
};
