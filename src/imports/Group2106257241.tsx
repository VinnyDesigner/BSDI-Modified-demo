import imgImage800 from "figma:asset/978c5f1b990ef26f5966fe81b50390e65409d52b.png";
import imgImage799 from "figma:asset/b3f240ca3bf07ce01d5f6998d0ca7ec5b38ae2e4.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute contents left-0 top-0">
        <div className="absolute h-[578px] left-0 top-[80.35px] w-[1007px]" data-name="image 800">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage800} />
        </div>
        <div className="absolute h-[634px] left-[653.72px] top-0 w-[1593px]" data-name="image 799">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage799} />
        </div>
      </div>
    </div>
  );
}