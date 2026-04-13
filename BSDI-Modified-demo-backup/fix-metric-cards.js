const fs = require("fs");
const path = require("path");

const dir = "c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

const cardTargetStr = `<Card 
                key={index} 
                className="relative h-[106px] bg-white/90 backdrop-blur-xl border-0 rounded-[24px] shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[12px_12px_32px_rgba(163,177,198,0.4),-12px_-12px_32px_rgba(255,255,255,1)] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden"
              >`;
              
const cardReplaceStr = `<Card 
                key={index} 
                className="relative h-[106px] border rounded-[18px] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden group"
                style={{
                  background: \`linear-gradient(135deg, \${kpi.color}15 0%, \${kpi.color}05 100%), rgba(255, 255, 255, 0.65)\`,
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = \`linear-gradient(135deg, \${kpi.color}20 0%, \${kpi.color}10 100%), rgba(255, 255, 255, 0.65)\`;
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = \`linear-gradient(135deg, \${kpi.color}15 0%, \${kpi.color}05 100%), rgba(255, 255, 255, 0.65)\`;
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                }}
              >`;

const textRegex1 = /<div className="text-\[36px\] leading-\[40px\] font-bold bg-gradient-to-br from-\[#1a1a1a\] to-\[#4a4a4a\] bg-clip-text text-transparent tracking-\[0\.37px\]">/g;
const textRegex2 = /<div className="text-\[36px\] leading-\[40px\] font-bold text-\[#1a1a1a\] tracking-tight\">/g;
const textReplaceStr = `<div className="text-[30px] leading-[36px] font-medium text-[#1a1a1a] tracking-tight">`;

let totalModified = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  if (content.includes(cardTargetStr)) {
    content = content.replaceAll(cardTargetStr, cardReplaceStr);
    modified = true;
  }
  
  if (textRegex1.test(content)) {
    content = content.replace(textRegex1, textReplaceStr);
    modified = true;
  }
  if (textRegex2.test(content)) {
    content = content.replace(textRegex2, textReplaceStr);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated: " + file);
    totalModified++;
  }
}
console.log("Total files updated: " + totalModified);
