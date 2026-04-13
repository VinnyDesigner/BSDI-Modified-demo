import re

path = "c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/DataAccessRequests.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

text = re.sub(r"\? 'bg-\[#([A-Z0-9]+)\]/(5|10)' : 'hover:bg-\[#EBECE8\]/30'", r"? 'bg-[#\1]/\2' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50') + ' hover:bg-[#EBECE8]/30'", text)

text = re.sub(r"\} bg-\[#(F8F9FA|FDF2F2|F5F5F5)\]`\}", r"} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}", text)

text = re.sub(r"\} hover:bg-\[#EBECE8\]/30 transition-colors`\}", r"} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#EBECE8]/30 transition-colors`}", text)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Rows updated successfully")
