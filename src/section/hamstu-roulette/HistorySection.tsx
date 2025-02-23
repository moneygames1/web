"use client";

import Image from "next/image";
import Vector4ImagePng from "../../assets/images/Vector5.png";
import VectornetSquares from "../../assets/images/vector-net-squares-lite.svg";
import LeftArrowIcon from "../../assets/images/leftArrow.svg";
import RightArrowIcon from "../../assets/images/rightArrow.svg";
import RightSkipArrowIcon from "../../assets/images/rightSkip.svg";
import { useEffect, useState } from "react";
import AllHistory from "./components/AllHistory";
import YourHistory from "./components/YourHistory";
import {
  GAME_CONTRACT_BSC_ADDRESS,
  GAME_TYPE,
  USDT_CONTRACT_ADDRESS,
} from "@/helpers/constants";
import { publicClient } from "@/components/Web3Provider";
import gameAbi from "@/helpers/abis/game.json";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

const historyOptions = [
  {
    id: 1,
    label: "ALL HISTORY",
  },
  {
    id: 2,
    label: "YOUR HISTORY",
  },
];

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

type HistorySectionProps = {
  winningNumber: number;
  gameId: number;
  gameDetails: GameDetails;
};

const HistorySection = ({
  winningNumber,
  gameId,
  gameDetails,
}: HistorySectionProps) => {
  const [history, setHistory] = useState(1);
  const [date] = useState("Jun 12, 2024, 10.00 PM"); // Assuming this is static
  const [gameInfo, setGameInfo] = useState({ gameId, winningNumber });
  const [allHistoryList, setAllHistoryList] = useState<
    { address: string; winningAmount: number }[]
  >([]);
  const { address: userWalletAddress } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [yourHistoryList, setYourHistoryList] = useState<
    {
      gameId: number;
      won: boolean;
      betNumber: number;
      winningAmount: number;
      betAmount: number;
    }[]
  >([]);

  useEffect(() => {
    setGameInfo({ gameId, winningNumber });
  }, [gameId, winningNumber, userWalletAddress]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        console.log("gameHistory id", history);

        const { gameId: currentGameId, winningNumber: currentWinningNumber } =
          gameInfo;
        if (history === 1) {
          if (gameDetails.numberOfBets == 0) return;

          const numberOfBetsOnANumber = await publicClient.readContract({
            address: GAME_CONTRACT_BSC_ADDRESS,
            abi: gameAbi,
            functionName: "getNumberOfBetsOnNumber",
            args: [currentGameId, currentWinningNumber],
          });

          const gameHistory = (await publicClient.readContract({
            address: GAME_CONTRACT_BSC_ADDRESS,
            abi: gameAbi,
            functionName: "getGameHistory",
            args: [
              currentGameId,
              currentWinningNumber,
              0,
              Number(numberOfBetsOnANumber),
            ],
          })) as [string[], bigint[]];

          console.log("gameHistory", gameHistory);

          const formattedHistory = [];
          for (let i = 0; i < gameHistory[0].length; i++) {
            formattedHistory.push({
              address: gameHistory[0][i],
              winningAmount: +formatUnits(BigInt(gameHistory[1][i]), 6),
            });
          }

          setAllHistoryList(formattedHistory);
        } else if (history === 2) {
          console.log({ userWalletAddress });

          if (!userWalletAddress) {
            return;
          }
          const [userBetNumbers, userBetAmounts, winNumber, winningAmount] =
            (await publicClient.readContract({
              address: GAME_CONTRACT_BSC_ADDRESS,
              abi: gameAbi,
              functionName: "getUserHistory",
              args: [currentGameId, userWalletAddress],
            })) as [bigint[], bigint[], bigint, bigint];
          console.log({
            userBetNumbers,
            userBetAmounts,
            winNumber,
            winningAmount,
          });
          const winningIdx = userBetNumbers.findIndex(
            (bet) => winNumber == bet
          );
          console.log({ winningIdx });
          const newYourHistoryList: {
            gameId: number;
            won: boolean;
            betNumber: number;
            winningAmount: number;
            betAmount: number;
          }[] = [];
          userBetNumbers.forEach((betNumber, idx) =>
            newYourHistoryList.push({
              gameId: currentGameId,
              won: idx == winningIdx,
              betNumber: Number(betNumber),
              winningAmount: +formatUnits(winningAmount, 6),
              betAmount: +formatUnits(userBetAmounts[idx], 6),
            })
          );
          setYourHistoryList(newYourHistoryList);
        }
      } catch (error) {
        console.error("Error fetching game history:", error);
      } finally {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [gameInfo, history]);
  const changeCurrentGameId = async (newGameId: number) => {
    setIsLoading(true);
    try {
      const [
        isFinalized,
        __,
        winNo,
        minBet,
        totBets,
        noOfBets,
        ___,
        ____,
        endTime,
      ] = (await publicClient.readContract({
        address: GAME_CONTRACT_BSC_ADDRESS,
        abi: gameAbi,
        functionName: "getGameDetails",
        args: [newGameId],
      })) as [
        boolean,
        unknown,
        bigint,
        bigint,
        bigint,
        bigint,
        unknown,
        unknown,
        bigint
      ];

      const newWinningNumber = Number(winNo);

      // Update gameInfo to trigger fetching the new game history
      setGameInfo({ gameId: newGameId, winningNumber: newWinningNumber });
    } catch (error) {
      console.error("Error decrementing gameId:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <section
        className="h-screen"
        style={{
          backgroundImage: `url(${Vector4ImagePng.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        <div style={{ paddingTop: 250 }}>
          <div
            className="flex flex-col items-center justify-center"
            style={{ gap: 30, marginBottom: 40 }}
          >
            <div className=" text-5xl text-center w-1/2 mx-auto text-primary font-outline-2">
              FINISHED ROUNDS
            </div>

            <div className="border-2 border-black rounded-lg -rotate-3 bg-pinky p-2 flex gap-2">
              {historyOptions.map((historyOption) => (
                <button
                  key={historyOption.id}
                  onClick={() => setHistory(historyOption.id)}
                  className={
                    history == historyOption.id
                      ? "uppercase p-2 pb-0 border-2 border-black rounded-lg -rotate-3 bg-secondary hover:rotate-0"
                      : ""
                  }
                >
                  {historyOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black px-[2px] pb-1 w-4/5 lg:w-1/2 mx-auto rounded-lg">
            <div className="lg:flex justify-between text-white uppercase p-4 pb-2">
              {history == 1 ? (
                <div className="">
                  <div className="mb-2 text-xl">
                    Season{" "}
                    <span className="bg-pinky p-2 pb-0 rounded-xl">
                      {gameInfo.gameId}
                    </span>
                  </div>
                  <div className="text-sm">{date}</div>
                </div>
              ) : (
                <div className="mb-2 text-xl">
                  Season{" "}
                  <span className="bg-pinky p-2 pb-0 rounded-xl">
                    {gameInfo.gameId}
                  </span>
                </div>
              )}
              <div className="flex gap-2 -mt-2">
                <button
                  onClick={() => changeCurrentGameId(gameInfo.gameId - 1)}
                  disabled={gameInfo.gameId == 0}
                  style={{
                    opacity: gameInfo.gameId == 0 ? 0.5 : 1,
                  }}
                >
                  <Image src={LeftArrowIcon} width={35} alt="-" />
                </button>
                <button
                  onClick={() => changeCurrentGameId(gameInfo.gameId + 1)}
                  disabled={gameInfo.gameId == gameId}
                  style={{
                    opacity: gameInfo.gameId == gameId ? 0.5 : 1,
                  }}
                >
                  <Image
                    src={RightArrowIcon}
                    width={35}
                    alt="-"
                    className="bg-gray-400"
                  />
                </button>
                <button onClick={() => changeCurrentGameId(gameId)}>
                  <Image src={RightSkipArrowIcon} width={35} alt="-" />
                </button>
              </div>
            </div>
            <div
              className="p-2 bg-primary rounded-b-lg relative"
              style={{ backgroundColor: "#FDEC2D" }}
            >
              <div
                style={{
                  backgroundImage: `url(${VectornetSquares.src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                }}
              >
                {isLoading ? (
                  <div className="text-center text-white text-2xl font-outline">
                    Loading...
                  </div>
                ) : history == 1 ? (
                  <AllHistory
                    allHistoryList={allHistoryList}
                    winningNumber={gameInfo.winningNumber}
                  />
                ) : (
                  <YourHistory yourHistoryList={yourHistoryList} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HistorySection;
