"use client";

import Image from "next/image";
import GreenStar from "../../../assets/images/greenStar.svg";
import Won from "../../../assets/images/won.svg";

type listObject = { address: string; winningAmount: number };

type AllHistoryProps = {
  allHistoryList: Array<listObject>;
  winningNumber: number | null;
};

const AllHistory = ({ allHistoryList, winningNumber }: AllHistoryProps) => {
  console.log("allHistoryList", allHistoryList);
  if (allHistoryList.length == 0 || !allHistoryList[0].address)
    return (
      <div className="text-center text-tertiary text-4xl font-outline py-8 uppercase">
        No History Found <br />
        for this season
      </div>
    );

  return (
    <>
      {winningNumber && <WinningCard winningNumber={winningNumber} />}
      <div>
        <div
          className="grid grid-cols-4 gap-8 p-6"
          style={{ maxHeight: "calc(2 * 10rem)", overflowY: "auto" }}
        >
          {allHistoryList.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-xl text-white font-outline">
                {item.address.slice(0, 6)}...
                {item.address.slice(-4)}
              </div>
              <div
                className=" flex justify-center gap-1 font-outline mt-2"
                style={{ color: "#B8FA2C" }}
              >
                <Image src={GreenStar} alt="-" style={{ marginTop: -4 }} />
                {item.winningAmount}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-2 flex justify-center">
        <button className="px-16 pt-2 pb-0 border-2 border-black rounded-lg bg-secondary">
          WATCH GAME HIGHLIGHTS
        </button>
      </div>
    </>
  );
};

const WinningCard: React.FC<{ winningNumber: number }> = ({
  winningNumber,
}) => {
  return (
    <div
      className="relative  flex items-center justify-center rounded-lg"
      style={{ marginBottom: 20 }}
    >
      <div
        className="flex items-center justify-center bg-black p-4 pt-8 text-8xl font-bold text-white relative z-1"
        style={{ borderRadius: "30px", minWidth: "120px" }}
      >
        {winningNumber}
      </div>

      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full shadow-md z-20 "
        style={{ top: "10px", left: "45%" }}
      >
        <Image src={Won} alt="-" width={160} />
      </div>
    </div>
  );
};

export default AllHistory;
