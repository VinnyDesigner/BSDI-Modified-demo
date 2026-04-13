import re

filepath = 'src/app/pages/modules/DataAccessRequests1.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to extract this top filter row from any TabsContent.
# The structure might be:
# <TabsContent value="some-value" className="max-w-full">
#   <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
#      [optional <div ...>]
#      {/* Top Filter Row - 65/35 split */}
#      <div className="px-6 py-4 flex items-center gap-4">
#          ...
#      </div>
#      <div className="px-6 pb-6">
#          <div className="scrollable-table-container ...">

# Let's find all sub-tab values in TabsContent which have a Top Filter Row.
tabs_contents = re.findall(r'<TabsContent[^>]*value="([^"]+)"[^>]*>(.*?)</TabsContent>', content, re.DOTALL)

extracted_searches = {}
tables = {}

for val, inner_content in tabs_contents:
    if "px-6 py-4 flex items-center gap-4" in inner_content:
        # Extract the search bar
        search_match = re.search(r'<div className="px-6 py-4 flex items-center gap-4">(.*?)</div>\s*<div className="px-6 pb-6">', inner_content, re.DOTALL)
        if search_match:
            extracted_searches[val] = search_match.group(1).strip()
            
            # The rest of the content (after px-6 pb-6) is the table part
            table_match = re.search(r'<div className="px-6 pb-6">(.*</div>)\s*</div>\s*(?:</div>\s*)?$', inner_content, re.DOTALL)
            if table_match:
                table_html = table_match.group(1).strip()
                # Strip out the last closing divs of the wrapper
                # We know the content of px-6 pb-6 ends with the end of scrollable-table-container.
                tables[val] = table_html

print(f"Found {len(extracted_searches)} search bars to process.")
for k in extracted_searches:
    print(f" - {k}")

