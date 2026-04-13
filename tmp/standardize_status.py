import re

file_path = r'd:\Projects\BSDI\BSDI-Modified-demo\src\app\pages\modules\DataAccessRequests1.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS for .status-badge
status_badge_css = """               .status-badge { 
                 padding: 4px 10px; 
                 border-radius: 999px; 
                 font-size: 12px; 
                 font-weight: 500; 
                 text-transform: capitalize; 
                 letter-spacing: 0.3px; 
                 width: fit-content; 
                 display: inline-flex; 
                 align-items: center; 
                 justify-content: center; 
                 background: #E6F0FA; 
                 color: #3D72A2; 
               }
               .status-badge.created-green, .status-badge.pending, .status-badge.forwarded { 
                 background: #E6F0FA !important; 
                 color: #3D72A2 !important; 
               }"""

content = re.sub(
    r'\.status-badge\s*\{[^}]*\}\s*\.status-badge\.created-green\s*\{[^}]*\}\s*\.status-badge\.pending\s*\{[^}]*\}\s*\.status-badge\.forwarded\s*\{[^}]*\}',
    status_badge_css,
    content,
    flags=re.MULTILINE | re.DOTALL
)

# 2. Update Column Alignment
content = content.replace('text-align: right;', 'text-align: left;')

# 3. Update Headers to include Status and alignment
content = content.replace('<th className="sticky-col-status"></th>', '<th className="sticky-col-status text-left">Status</th>')

# 4. Convert Status text to Titlecase in badges
content = content.replace('>CREATED<', '>Created<')
content = content.replace('>APPROVED<', '>Approved<')
content = content.replace('>PENDING<', '>Pending<')
content = content.replace('>FORWARDED<', '>Forwarded<')
content = content.replace("'APPROVED'", "'Approved'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Standardization complete.")
