const fs = require('fs');

let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// =============================================================================
// HELPER: Generate search + date range bar JSX for a given tab value
// Maps tab value -> { searchVar, setSearchVar, dateVar, setDateVar, placeholder, accentColor }
// =============================================================================
const tabSearchConfig = {
  // Block 1: org-completed
  'org-completed': {
    searchVar: 'orgCompletedSearch',
    setSearch: 'setOrgCompletedSearch',
    dateVar: 'orgCompletedDateRange',
    setDate: 'setOrgCompletedDateRange',
    placeholder: 'Search completed requests...',
    color: '#10B981',
  },
  // Block 2: dept-pending (in dept block)
  'dept-pending': {
    searchVar: 'deptPendingSearch',
    setSearch: 'setDeptPendingSearch',
    dateVar: 'deptPendingDateRange',
    setDate: 'setDeptPendingDateRange',
    placeholder: 'Search pending requests...',
    color: '#EF4444',
  },
  // Block 2: dept-completed (in dept block) - already there, keep
  'dept-completed': {
    searchVar: 'orgCompletedSearch',
    setSearch: 'setOrgCompletedSearch',
    dateVar: 'orgCompletedDateRange',
    setDate: 'setOrgCompletedDateRange',
    placeholder: 'Search completed requests...',
    color: '#10B981',
  },
  // Block 3: user-pending / user-completed
  'user-pending': {
    searchVar: 'userRequestPendingSearch',
    setSearch: 'setUserRequestPendingSearch',
    dateVar: 'userRequestPendingDateRange',
    setDate: 'setUserRequestPendingDateRange',
    placeholder: 'Search pending requests...',
    color: '#EF4444',
  },
  'user-completed': {
    searchVar: 'userRequestCompletedSearch',
    setSearch: 'setUserRequestCompletedSearch',
    dateVar: 'userRequestCompletedDateRange',
    setDate: 'setUserRequestCompletedDateRange',
    placeholder: 'Search completed requests...',
    color: '#10B981',
  },
  // Block 4: dept-forwarded (in data-access block)
  'dept-forwarded': {
    searchVar: 'dataAccessForwardedSearch',
    setSearch: 'setDataAccessForwardedSearch',
    dateVar: 'orgCompletedDateRange',
    setDate: 'setOrgCompletedDateRange',
    placeholder: 'Search forwarded requests...',
    color: '#F59E0B',
  },
  // Block 6: spatial-permission sub-tabs (pending=dept-pending, completed=org-completed)
  // Already handled by dept-pending and dept-completed above

  // Block 7: data-download tabs
  'data-download-forwarded': {
    searchVar: 'dataDownloadForwardedSearch',
    setSearch: 'setDataDownloadForwardedSearch',
    dateVar: 'dataDownloadForwardedDateRange',
    setDate: 'setDataDownloadForwardedDateRange',
    placeholder: 'Search forwarded requests...',
    color: '#F59E0B',
  },

  // Block 8: metadata tabs
  'metadata-pending': {
    searchVar: 'metadataPendingSearch',
    setSearch: 'setMetadataPendingSearch',
    dateVar: 'metadataPendingDateRange',
    setDate: 'setMetadataPendingDateRange',
    placeholder: 'Search pending requests...',
    color: '#EF4444',
  },
  'metadata-completed': {
    searchVar: 'metadataCompletedSearch',
    setSearch: 'setMetadataCompletedSearch',
    dateVar: 'metadataCompletedDateRange',
    setDate: 'setMetadataCompletedDateRange',
    placeholder: 'Search completed requests...',
    color: '#10B981',
  },
};

function makeSearchBar(tabValue, cfg) {
  return `<TabsContent value="${tabValue}" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="${cfg.placeholder}"
            value={${cfg.searchVar}}
            onChange={(e) => ${cfg.setSearch}(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[${cfg.color}] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={${cfg.dateVar}.from}
              onChange={(e) => ${cfg.setDate}({ ...${cfg.dateVar}, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[${cfg.color}] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={${cfg.dateVar}.to}
              onChange={(e) => ${cfg.setDate}({ ...${cfg.dateVar}, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[${cfg.color}] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>`;
}

// =============================================================================
// Find each header block and insert missing search bars before the closing </div>
// =============================================================================

const HEADER_MARKER = 'flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1';

let result = '';
let offset = 0;
let blockNum = 0;

while (true) {
  const markerIdx = content.indexOf(HEADER_MARKER, offset);
  if (markerIdx < 0) {
    result += content.substring(offset);
    break;
  }

  // Find start of the enclosing <div tag
  const tagStart = content.lastIndexOf('<div', markerIdx);
  // Find end of the entire header block (matching </div>)
  let d = 0;
  let j = tagStart;
  let blockEnd = -1;
  while (j < content.length) {
    if (content[j] === '<') {
      const sub4 = content.substring(j, j + 4);
      const sub6 = content.substring(j, j + 6);
      if (sub4 === '<div') {
        const nc = content[j + 4];
        if (nc === ' ' || nc === '>' || nc === '\n' || nc === '\r') {
          d++;
          const gt = content.indexOf('>', j);
          j = gt + 1;
          continue;
        }
      } else if (sub6 === '</div>') {
        d--;
        if (d <= 0) {
          blockEnd = j + 6;
          break;
        }
        j += 6;
        continue;
      }
    }
    j++;
  }

  if (blockEnd < 0) {
    result += content.substring(offset, markerIdx + HEADER_MARKER.length);
    offset = markerIdx + HEADER_MARKER.length;
    continue;
  }

  const headerBlock = content.substring(tagStart, blockEnd);
  blockNum++;

  // Find which tab values are present in this header block
  const allTriggers = [...headerBlock.matchAll(/value="([^"]+)"/g)].map(m => m[1]);
  // Deduplicate
  const uniqueTriggers = [...new Set(allTriggers)];

  // Find which tab values already have a search bar (flex justify-end TabsContent)
  const existingSearch = [...headerBlock.matchAll(/<TabsContent[^>]+value="([^"]+)"[^>]*flex justify-end/g)].map(m => m[1]);

  // Find which are missing
  const missing = uniqueTriggers.filter(t => !existingSearch.includes(t) && tabSearchConfig[t]);

  if (missing.length === 0) {
    // Nothing to add for this block
    result += content.substring(offset, blockEnd);
    offset = blockEnd;
    console.log(`Block ${blockNum}: No changes needed.`);
    continue;
  }

  console.log(`Block ${blockNum}: Adding search for: ${missing.join(', ')}`);

  // Insert search bars just before the closing </div> of the header block
  // Find the position of the last </div> in the block
  const closingDivPos = tagStart + headerBlock.lastIndexOf('</div>');

  // Build insertion
  const insertion = '\n' + missing.map(t => makeSearchBar(t, tabSearchConfig[t])).join('\n') + '\n';

  result += content.substring(offset, closingDivPos);
  result += insertion;
  result += '</div>';
  offset = blockEnd;
}

fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', result, 'utf8');

console.log('\n✅ Done! Search bars added to all header rows.');
const remaining = (result.match(/flex items-center justify-between border-b/g) || []).length;
console.log(`Total header rows processed: ${remaining}`);
