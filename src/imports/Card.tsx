import svgPaths from "./svg-nm2w6lsk2l";

export default function Card() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] overflow-clip relative rounded-[24px] shadow-[8px_8px_24px_0px_rgba(163,177,198,0.3),-8px_-8px_24px_0px_rgba(255,255,255,0.8)] size-full" data-name="Card">
      <div className="absolute left-[246px] size-[30px] top-[37px]" data-name="Icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <g id="Icon">
            <path d={svgPaths.p3e742400} id="Vector" stroke="var(--stroke-0, #ED1C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p2fe60e80} id="Vector_2" stroke="var(--stroke-0, #ED1C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p3fba0700} id="Vector_3" stroke="var(--stroke-0, #ED1C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M12.5 7.5H17.5" id="Vector_4" stroke="var(--stroke-0, #ED1C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M12.5 12.5H17.5" id="Vector_5" stroke="var(--stroke-0, #ED1C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M12.5 17.5H17.5" id="Vector_6" stroke="var(--stroke-0, #ED1C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M12.5 22.5H17.5" id="Vector_7" stroke="var(--stroke-0, #ED1C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
      <div className="absolute bg-gradient-to-r content-stretch flex from-[#f0fdf4] h-[24px] items-center justify-center left-[316px] overflow-clip px-[12px] py-[4px] rounded-[16777200px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] to-[#dcfce7] top-[11.5px] w-[44.883px]" data-name="Badge">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#008236] text-[12px] whitespace-nowrap">+12</p>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[8px] h-[68px] items-start left-[23.88px] top-[18px] w-[127px]" data-name="div">
        <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
          <p className="absolute bg-clip-text font-['Inter:Bold',sans-serif] font-bold leading-[40px] left-0 not-italic text-[36px] text-[transparent] top-[0.5px] tracking-[0.3691px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(rgb(26, 26, 26) 0%, rgb(74, 74, 74) 100%)" }}>
            142
          </p>
        </div>
        <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#666] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Total Organizations</p>
        </div>
      </div>
    </div>
  );
}