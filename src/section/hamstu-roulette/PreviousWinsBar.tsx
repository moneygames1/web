"use client";

import { useEffect, useState } from "react";
import { publicClient } from "@/components/Web3Provider";
import { GAME_CONTRACT_BSC_ADDRESS } from "@/helpers/constants";
import gameAbi from "@/helpers/abis/game.json";

type CurrentGameSeasonId = {
  seasonId: number;
  gameId: number;
};

const PreviousWinsBar = ({
  currentGameSeasonId,
}: {
  currentGameSeasonId: CurrentGameSeasonId;
}) => {
  const [previousWins, setPreviousWins] = useState<number[]>([]);

  useEffect(() => {
    const fetchPreviousWins = async () => {
      try {
        const prevWins = (await publicClient.readContract({
          address: GAME_CONTRACT_BSC_ADDRESS,
          abi: gameAbi,
          functionName: "getPreviousWins",
          args: [0, currentGameSeasonId.gameId + 1],
        })) as bigint[];

        // Convert to numbers and ensure a maximum length of 26
        console.log("getPreviousWins", prevWins);

        const wins = prevWins.map(Number);
        setPreviousWins(wins.slice(-26)); // Take the last 26 wins
      } catch (error) {
        console.error("Error fetching previous wins:", error);
      }
    };

    fetchPreviousWins();
  }, [currentGameSeasonId.gameId]);

  return (
    <section className="flex gap-2 bg-tertiary p-2 items-center justify-center">
      <div className="uppercase text-white text-2xl">previous wins</div>
      <div className="flex gap-2 ">
        {previousWins.map((ele) => {
          const isRed = ele % 2 === 0;
          return (
            <div
              key={ele}
              className={` px-2 pt-1 w-fit rounded-lg border-2 border-black border-b-[6px] flex gap-2 items-center justify-center ${
                isRed ? "bg-lightRed" : "bg-black"
              }`}
            >
              <div className="text-white font-outline text-lg">{ele}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PreviousWinsBar;
