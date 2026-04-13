import re

path = "c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/DataAccessRequests.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("'bg-[#FAFAFA]'", "'bg-gray-50'")
text = text.replace("'bg-[#F9F9F9]'", "'bg-gray-50'")

text = text.replace("'hover:bg-[#EBECE8]/50'", "'hover:bg-[#EBECE8]/30'")
text = text.replace("hover:bg-[#EBECE8]/50", "hover:bg-[#EBECE8]/30")

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Standardized colors to light grey and reset hover borders")
