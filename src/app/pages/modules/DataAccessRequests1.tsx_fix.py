
import sys

filepath = r"d:\BSDI\BSDI-V3\BSDI-Modified-demo\src\app\pages\modules\DataAccessRequests1.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Replace Pending badge with Approve button in Pending tab
pending_badge_pattern = """                                       <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}`}>
                                           {request?.status || "Pending"}
                                       </span>"""

approve_button = """                                       <button 
                                         className="flex items-center justify-center px-4 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] text-[12px] font-semibold transition-colors shadow-sm"
                                         onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                       >
                                         Approve
                                       </button>"""

if pending_badge_pattern in content:
    content = content.replace(pending_badge_pattern, approve_button)
    print("Replaced Pending badge with Approve button")
else:
    print("Could not find Pending badge pattern")

# Fix 2: Add Comments cell in Completed tab
completed_row_end = """                                   <td className="sticky-col-status">"""
comments_cell = """                                   <td>
                                       <span className="text-[#374151] text-[13px]">Approved for planning purposes</span>
                                   </td>
                                   <td className="sticky-col-status">"""

# We need to be careful as sticky-col-status appears in many places. 
# We target the one in org-completed table.
# Actually, I'll use a more specific anchor for the Completed tab rows.

# Looking at previous view_file:
# 4078:                                       {request.approvedBy}
# 4079:                                   </td>
# 4080:                                   <td className="sticky-col-status">

row_anchor = """                                       {request.approvedBy}
                                   </td>
                                   <td className="sticky-col-status">"""

row_replacement = """                                       {request.approvedBy}
                                   </td>
                                   <td>
                                       <span className="text-[#374151] text-[13px]">Approved for planning purposes</span>
                                   </td>
                                   <td className="sticky-col-status">"""

if row_anchor in content:
    content = content.replace(row_anchor, row_replacement)
    print("Added Comments cell to Completed tab")
else:
    # Try with different indentations if needed, but the anchor above is from the view_file output.
    print("Could not find row anchor for Completed tab")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
