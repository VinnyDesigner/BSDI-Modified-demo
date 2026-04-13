import imgScreenshot20260306At12159Pm1 from "figma:asset/a3e48916f5bae35616068e9e8700ee89d2850bd1.png";
import imgScreenshot20260306At12220Pm1 from "figma:asset/d8ab26c6d7411289d15de0d6adc67513924eafd4.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute contents left-0 top-0">
        <div className="absolute h-[315.634px] left-0 top-0 w-[810.21px]" data-name="Screenshot 2026-03-06 at 1.21.59 PM 1">
          <img alt="" className="absolute block max-w-none size-full" height="315.634" src={imgScreenshot20260306At12159Pm1} width="810.21" />
        </div>
        <div className="absolute bg-[#deeaf3] h-[44.912px] left-[14.56px] top-[16.03px] w-[375.428px]" />
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[21.704px] left-[132.31px] not-italic text-[15.193px] text-black text-center top-[16.03px] tracking-[-0.1632px] whitespace-nowrap">Requests Received per Service</p>
      </div>
      <div className="absolute contents left-[795.05px] top-0">
        <div className="absolute h-[312.223px] left-[795.05px] top-0 w-[420.717px]" data-name="Screenshot 2026-03-06 at 1.22.20 PM 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[143.78%] left-[-14.97%] max-w-none top-[-37.56%] w-[119.9%]" src={imgScreenshot20260306At12220Pm1} />
          </div>
        </div>
        <div className="absolute bg-[#deeaf3] h-[38.864px] left-[807.7px] top-[19.68px] w-[214.769px]" />
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[20.089px] left-[878.72px] not-italic text-[14.062px] text-black text-center top-[28.93px] tracking-[-0.1511px] whitespace-nowrap">Top Used Services</p>
      </div>
    </div>
  );
}