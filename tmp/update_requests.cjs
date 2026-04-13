
const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Projects', 'BSDI', 'BSDI-Modified-demo', 'src', 'app', 'pages', 'modules', 'DataAccessRequests.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update CSS
const oldStyles = `const rowStyles = \`
  .request-row-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: #D1D5DB transparent;
  }
  .request-row-wrapper::-webkit-scrollbar {
    height: 6px;
  }
  .request-row-wrapper::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 6px;
  }
  .request-row {
    min-width: 1100px;
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 4px 0;
  }
  .column-fixed {
    flex: 0 0 auto;
  }
\`;`;

const newStyles = `const rowStyles = \`
  .request-row-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: #D1D5DB transparent;
  }
  .request-row-wrapper::-webkit-scrollbar {
    height: 6px;
  }
  .request-row-wrapper::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 6px;
  }
  .request-row {
    min-width: 1100px;
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 4px 0;
  }
  .column-fixed {
    flex: 0 0 auto;
  }

  .request-table-wrapper {
    display: flex;
    background: #FFFFFF;
    border-radius: 16px;
    padding: 16px;
    margin: 0 16px;
    overflow: hidden;
  }
  .table-fixed-left,
  .table-fixed-right {
    flex-shrink: 0;
    background: #FFFFFF;
    z-index: 2;
  }
  .table-fixed-left {
    width: 160px;
    border-right: 1px solid #F1F5F9;
  }
  .table-fixed-right {
    width: 120px;
    border-left: 1px solid #F1F5F9;
    text-align: center;
  }
  .table-scrollable {
    overflow-x: auto;
    flex: 1;
  }
  .table-scrollable::-webkit-scrollbar {
    display: none; /* hide scrollbar */
  }
  .header-row,
  .row {
    display: grid;
    grid-template-columns: 
      220px   /* Department */
      120px   /* Type */
      200px   /* Organization */
      200px   /* Submitted By */
      160px   /* Date */
      300px;  /* Description */
    column-gap: 16px;
    align-items: center;
  }
  .header,
  .header-row {
    font-size: 13px;
    font-weight: 500;
    color: rgba(107,114,128,0.65);
    padding-bottom: 12px;
  }
  .cell,
  .row {
    height: 60px;
    border-bottom: 1px solid #F1F5F9;
    font-size: 14px;
    color: #111827;
    display: flex;
    align-items: center;
  }
  .request-table-wrapper .row:hover,
  .request-table-wrapper .cell:hover {
    background: #F9FAFB;
  }
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
\`;`;

if (content.includes(oldStyles)) {
    content = content.replace(oldStyles, newStyles);
    console.log("CSS updated.");
} else {
    console.log("CSS block not found precisely.");
}

// 2. Update JSX
const toReplace = `<div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {filteredDeptPending.map((request, index) => (`.trim();

const newJSX = `                    <div className="request-table-wrapper flex-col gap-0 border-t border-[#E5E7EB] p-0 mx-0 rounded-none">
                      {/* Table Header */}
                      <div className="flex border-b border-[#F1F5F9] bg-[#F8FAFC]">
                        {/* Fixed Left Header */}
                        <div className="table-fixed-left !border-b-0 !bg-[#F8FAFC]">
                          <div className="header px-[18px] py-3 pb-3 truncate">Request ID</div>
                        </div>
                        {/* Scrollable Middle Header */}
                        <div className="table-scrollable">
                          <div className="header-row !pb-0 py-3">
                            <div className="px-2">Department</div>
                            <div className="px-2">Type</div>
                            <div className="px-2">Organization</div>
                            <div className="px-2">Submitted By</div>
                            <div className="px-2">Requested Date</div>
                            <div className="px-2">Business Description</div>
                          </div>
                        </div>
                        {/* Fixed Right Header */}
                        <div className="table-fixed-right !border-b-0 !bg-[#F8FAFC]">
                          <div className="header py-3 pb-3">Actions</div>
                        </div>
                      </div>

                      {/* Table Body */}
                      {filteredDeptPending.map((request, index) => (
                        <div key={request.id} className="flex hover:bg-[#F9FAFB] transition-colors border-b border-[#F1F5F9] last:border-0 group">
                          {/* Fixed Left Cell */}
                          <div className="table-fixed-left !bg-transparent flex items-center px-[18px]">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle Content */}
                          <div className="table-scrollable">
                            <div className="row !border-b-0 !bg-transparent">
                              {/* Department */}
                              <div className="px-2 flex flex-col justify-center">
                                <span className="text-[14px] font-medium text-[#111827] line-clamp-1">{request.departmentNameEn}</span>
                                <span className="text-[11px] text-[#6B7280] line-clamp-1" dir="rtl">{request.departmentNameAr}</span>
                              </div>

                              {/* Type */}
                              <div className="px-2">
                                <Badge className="bg-[#0099DD]/10 text-[#0099DD] border-0 font-medium px-3 py-1 rounded-lg w-fit text-[10px] uppercase tracking-wider">
                                  {request.type}
                                </Badge>
                              </div>

                              {/* Organization */}
                              <div className="px-2">
                                <span className="text-[14px] font-medium text-[#111827] line-clamp-1">{request.organization}</span>
                              </div>

                              {/* Submitted By */}
                              <div className="px-2 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#E5E7EB] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#4B5563]">
                                  {request.submittedBy?.[0] || "L"}
                                </div>
                                <span className="text-[14px] font-medium text-[#111827] line-clamp-1">{request.submittedBy}</span>
                              </div>

                              {/* Requested Date */}
                              <div className="px-2 flex items-center gap-2 text-[#4B5563]">
                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="text-[14px] font-medium">{request.date}</span>
                              </div>

                              {/* Business Description */}
                              <div className="px-2">
                                <p className="text-[13px] font-normal text-[#4B5563] leading-relaxed line-clamp-1 truncate">{request.businessDescription}</p>
                              </div>
                            </div>
                          </div>

                          {/* Fixed Right Cell */}
                          <div className="table-fixed-right !bg-transparent flex items-center justify-center">
                            <div className="action-buttons">
                              {!isReviewer && (
                                <>
                                  <Button 
                                    onClick={() => handleApproveClick(request.id)}
                                    size="icon"
                                    className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[32px] w-[32px] rounded-lg shadow-sm transition-colors border border-[#10B981]/20"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    onClick={() => handleRejectClick(request)}
                                    size="icon"
                                    variant="outline"
                                    className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[32px] w-[32px] rounded-lg shadow-sm transition-colors border border-[#ED1C24]/20"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              {isReviewer && <span className="text-[10px] font-bold text-[#9CA3AF] uppercase italic">Read Only</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>`;

const startPos = content.indexOf(toReplace);
if (startPos !== -1) {
    const mapEnd = content.indexOf('                      ))}', startPos);
    if (mapEnd !== -1) {
        const finalEnd = content.indexOf('                    </div>', mapEnd) + '                    </div>'.length;
        const blockToReplace = content.substring(startPos, finalEnd);
        content = content.replace(blockToReplace, newJSX);
        console.log("JSX updated.");
    } else {
        console.log("Map end not found.");
    }
} else {
    console.log("JSX start block not found.");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Done.");
