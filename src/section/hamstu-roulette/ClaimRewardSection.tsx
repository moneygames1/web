import Image from "next/image";
// import GreenStar from "/../../assets/images/greenStar.svg";
import GreenStar from "../../assets/images/greenStar.svg";
import GreenChip from "../../assets/images/green-chip.svg";

const claimsList = [
  { number: 12, season: 12, betAmount: "1.03 ETH", prize: "10.91 ETH" },
  { number: 7, season: 12, betAmount: "1.03 ETH", prize: "10.91 ETH" },
];

const ClaimRewardSection = () => {
  return (
    <section className="flex flex-col items-center" style={{ marginTop: 80 }}>
      <div className="uppercase text-4xl text-tertiary font-outline mb-4">
        claim your rewards!!!
      </div>
      <ClaimCard />
    </section>
  );
};

const ClaimCard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-4 uppercase text-center">
        <p>season</p>
        <p>number</p>
        <p>bet amount</p>
        <p>prize</p>
        <div className=" flex flex-col gap-4" style={{ gridColumn: "span 4" }}>
          {claimsList.map((claim, idx) => (
            <>
              <div
                className="text-xl flex justify-center gap-8 rounded-xl bg-tertiary items-center border-2 border-black border-b-[6px]"
                style={{ paddingLeft: 50, paddingRight: 50 }}
              >
                <div className=" text-white uppercase">
                  season {claim.season}
                </div>
                <div
                  key={claim.number}
                  className={`-rotate-3 px-6 pt-4 pb-2 w-fit rounded-xl border-2 border-black ${
                    claim.number % 2 === 0 ? "bg-black" : "bg-lightRed"
                  }`}
                >
                  <div className="text-white font-outline text-5xl ">
                    {claim.number}
                  </div>
                </div>
                <div className="flex gap-1 text-white">
                  <Image src={GreenChip} alt="-" className="-mt-1" />
                  {claim.betAmount}
                </div>
                <div
                  className="font-outline flex text-2xl"
                  style={{ color: "#B8FA2C" }}
                >
                  <Image src={GreenStar} width={24} alt="-" className="-mt-1" />
                  {claim.prize}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClaimRewardSection;
