import Button from "@/components/Button";
import VectornetSquares from "../../assets/images/vector-net-squares.svg";
import { useCart } from "@/hooks/UseCartContext";
import Image from "next/image";
import GreenChip from "../../assets/images/green-chip.svg";
import { useAccount } from "wagmi";

type OddBet = {
  odd: number;
  betAmount: number;
  value: number;
};

type GameDetails = {
  isFinalized: boolean;
  winningNumber: number;
  minBetAmount: number;
  totalBets: number;
  numberOfBets: number;
  gameEndTime: Date;
  oddBets: Array<OddBet>;
  totalBetAmount: number;
};

type PlaceBetModalSectionProps = {
  setIsBuyTileModal: () => void;
  gameDetails: GameDetails;
  gameId: number;
  isTimeEnded: boolean;
};

const PlaceBetModalSection = ({
  setIsBuyTileModal,
  gameDetails,
  gameId,
  isTimeEnded,
}: PlaceBetModalSectionProps) => {
  const { orderedPlaced } = useCart();
  const { address: userWalletAddress, isConnected } = useAccount();

  return (
    <section
      className=" border-2 bg-black border-black rounded-xl cursor-default flex flex-col"
      style={{ height: "384px" }}
    >
      <div className=" p-2" style={{ height: "15%" }}>
        <div className="uppercase text-white flex justify-between items-center h-full">
          <p>upcoming</p>
          <p>
            Season {gameId} |{" "}
            {gameDetails.gameEndTime.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      <div
        className="bg-tertiary flex flex-col items-center justify-center gap-8"
        style={{
          height: "84%",
          backgroundImage: `url(${VectornetSquares.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        {orderedPlaced.length === 0 ? (
          <div className="uppercase text-2xl text-center">
            {isTimeEnded ? (
              "season has ended"
            ) : (
              <span>
                you haven&apos;t placed <br /> a bet yet
              </span>
            )}
          </div>
        ) : (
          <div
            className="flex justify-start gap-2 pt-4 px-1"
            style={{
              maxWidth: "calc(4 * 8rem)",
              overflowX: "auto",
            }}
          >
            {orderedPlaced.map((cartItem, idx) => {
              const isRed = cartItem.betNumber % 2 === 0;
              return (
                <div
                  key={cartItem.betNumber}
                  className={`px-6 pt-4 pb-2 rounded-xl border-2 border-black border-b-[6px] flex flex-col items-center ${
                    isRed ? "bg-lightRed rotate-2" : "bg-black -rotate-3"
                  }`}
                >
                  <div className="text-white font-outline text-4xl">
                    {cartItem.betNumber}
                  </div>
                  <div className="text-white flex gap-1 ">
                    <Image src={GreenChip} width={16} alt="-" />
                    <span style={{ whiteSpace: "nowrap" }}>
                      ${cartItem.usdValue}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button
          extraClassName="text-xl px-8 uppercase"
          onClick={setIsBuyTileModal}
          isDisabled={isTimeEnded || !isConnected}
        >
          {orderedPlaced.length > 0 ? "add more bets" : "add bet"}
        </Button>
      </div>
    </section>
  );
};

export default PlaceBetModalSection;
