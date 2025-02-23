import Image from "next/image";
import GreenChip from "../../../assets/images/green-chip.svg";
import Won from "../../../assets/images/won.svg";
import GreenStar from "../../../assets/images/greenStar.svg";

type YourHistoryProps = {
  yourHistoryList: Array<{
    gameId: number;
    won: boolean;
    betNumber: number;
    betAmount: number;
    winningAmount: number;
  }>;
};

const YourHistory = ({ yourHistoryList }: YourHistoryProps) => {
  console.log("yourHistoryList", yourHistoryList);

  if (yourHistoryList.length == 0) {
    return (
      <div className="uppercase text-center py-8">
        <div>No history found</div>
        <div className="text-tertiary text-4xl font-outline">
          place your bet for the <br /> next round
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-3 gap-8 p-4"
      style={{
        maxHeight: "calc(2 * 13rem + 3rem)", // Adjust the maxHeight based on your row height (e.g., 8rem per row)
        overflowY: "auto",
      }}
    >
      {yourHistoryList.map((option, idx) => {
        return (
          <div key={idx} className="flex flex-col justify-center items-center">
            {/* <div className="text-md uppercase">season {option.gameId}</div> */}
            <div
              className={`relative py-8 rounded-2xl border-2 border-black border-b-[6px] flex flex-col items-center justify-center ${
                option.won ? "bg-tertiary pt-4 pb-2" : "bg-primary"
              }`}
              style={{ width: "10rem" }}
            >
              {option.won && (
                <>
                  <div
                    className=" flex justify-center gap-1 font-outline text-xl mb-2"
                    style={{ color: "#B8FA2C" }}
                  >
                    <Image src={GreenStar} alt="-" style={{ marginTop: -4 }} />
                    {option.winningAmount}$
                  </div>
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full shadow-md z-20 "
                    style={{ top: "10px", left: "5px" }}
                  >
                    <Image src={Won} alt="-" width={65} />
                  </div>
                </>
              )}
              <div
                className={` pt-4 rounded-2xl border-2 border-black border-b-[6px] flex flex-col items-center justify-center ${
                  option.betNumber % 2 == 0 ? "bg-lightRed" : "bg-black"
                }`}
                style={{ width: "6rem" }}
              >
                <div className="text-white font-outline-2 text-6xl">
                  {option.betNumber}
                </div>
                <div className="text-white flex gap-1">
                  <Image src={GreenChip} alt="-" />
                  {option.betAmount}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YourHistory;
