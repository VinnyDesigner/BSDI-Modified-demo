import os
import re

def fix_colors(content):
    # Direct color replace
    content = content.replace('#ED1C24', '#EF4444')
    content = content.replace('text-[#ED1C24]', 'text-[#EF4444]')
    content = content.replace('bg-[#ED1C24]', 'bg-[#EF4444]')
    content = content.replace('border-[#ED1C24]', 'border-[#EF4444]')
    
    # Tailwind classes
    content = content.replace('from-[#ED1C24]', 'from-[#EF4444]')
    content = content.replace('to-[#ED1C24]', 'to-[#EF4444]')
    
    # Gradient standardizer
    # old: from-[#ED1C24] to-[#d41820] -> from-[#EF4444] to-[#DC2626]
    content = content.replace('to-[#d41820]', 'to-[#DC2626]')
    content = content.replace('hover:from-[#d41820]', 'hover:from-[#DC2626]')
    content = content.replace('hover:to-[#c0151b]', 'hover:to-[#991B1B]')
    
    return content

files = [
    r'd:\BSDI\BSDI-V3\BSDI-Modified-demo\src\app\pages\modules\SpatialGovernance.tsx',
    r'd:\BSDI\BSDI-V3\BSDI-Modified-demo\src\app\pages\modules\DataAccessRequests1.tsx',
    r'd:\BSDI\BSDI-V3\BSDI-Modified-demo\src\app\pages\modules\DataAccessRequests.tsx'
]

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = fix_colors(content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed colors in {file_path}")
        else:
            print(f"No changes needed in {file_path}")
    else:
        print(f"File not found: {file_path}")
