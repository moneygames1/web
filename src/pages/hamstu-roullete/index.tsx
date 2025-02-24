"use client";

import Button from "@/components/Button";
import { Luckiest_Guy } from "next/font/google";
import Image from "next/image";

import Footer from "@/components/Footer";
import { useCallback, useEffect, useRef, useState } from "react";
import { publicClient } from "@/components/Web3Provider";
import {
  GAME_CONTRACT_BSC_ADDRESS,
  GAME_TYPE,
  USDT_CONTRACT_ADDRESS,
  USDT_DECIMALS_ON_BSC,
} from "@/helpers/constants";
import gameAbi from "@/helpers/abis/game.json";
import {
  createWalletClient,
  custom,
  erc20Abi,
  formatUnits,
  parseUnits,
} from "viem";
import { FAQ } from "@/components/Faq";
import Countdown from "react-countdown";
import { useAccount, useBalance } from "wagmi";
import { baseSepolia, bsc } from "viem/chains";
import GreenCoinSvg from "../../assets/images/green-coin.svg";
import Confetti from "../../assets/images/confetti.gif";
import StarSvg from "../../assets/images/star.svg";
import NetVector1 from "../../assets/images/net-vector1.svg";
import BuyTilesModal from "@/components/BuyTilesModal";
import HistorySection from "@/section/hamstu-roulette/HistorySection";
import HeroSection from "@/section/hamstu-roulette/HeroSection";
import HeaderSection from "@/section/hamstu-roulette/HeaderSection";
import PreviousWinsBar from "@/section/hamstu-roulette/PreviousWinsBar";
import PlaceBetModalSection from "@/section/hamstu-roulette/PlaceBetModalSection";
import ClaimRewardSection from "@/section/hamstu-roulette/ClaimRewardSection";
import CountDownSection from "@/section/hamstu-roulette/CountDownSection";
import { CartProvider } from "@/hooks/UseCartContext";
// import vector3Svg from '../../assets/images/vector3.svg';

const luckiestGuyFont = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
});

const RatRoullete = () => {
  const yourBetsRef = useRef<HTMLDivElement>(null);
  const [isCheckRewards, setIsCheckRewards] = useState(false);

  const gameType = GAME_TYPE.RAT_ROULETTE;
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isBuyModal, setIsBuyModal] = useState(false);
  const [isBuyTileModal, setIsBuyTileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [betNumberDetails, setBetNumberDetails] = useState({
    value: 0,
    betAmount: 0,
    odd: 1,
  });
  const [currentGameSeasonId, setCurrentGameSeasonId] = useState({
    seasonId: 0,
    gameId: 0,
  });

  const [userBetInfo, setUserBetInfo] = useState<
    {
      betNumber: number;
      betAmount: number;
    }[]
  >([]);

  const { address: userWalletAddress } = useAccount();
  const balance = useBalance({
    address: userWalletAddress,
    token: USDT_CONTRACT_ADDRESS,
  }).data;

  const [isTimeEnded, setIsTimeEnded] = useState(true);

  const array24 = new Array(24)
    .fill({
      odd: 0,
      betAmount: 0,
    })
    .map((_, index) => ({
      odd: index + 1,
      betAmount: 0,
      value: index + 1,
    }));

  const [gameDetails, setGameDetails] = useState({
    isFinalized: false,
    winningNumber: 0,
    minBetAmount: 1,
    totalBets: 0,
    numberOfBets: 0,
    gameEndTime: new Date(new Date().getTime() + 86400000),
    oddBets: array24,
    totalBetAmount: 0,
  });

  const [userClaimDetails, setUserClaimDetails] = useState<{
    loading: boolean;
    info: {
      gameId: number;
      betNumber: number;
      betAmount: number;
      winningAmount: number;
    }[];
  }>({
    loading: true,
    info: [],
  });

  const openBuyModal = () => {
    setIsBuyModal(true);
  };

  const closeBuyModal = () => {
    setIsBuyModal(false);
  };

  const getClaimDetails = async () => {
    if (!userWalletAddress) {
      setUserClaimDetails({
        loading: false,
        info: [],
      });
      return;
    }
    try {
      const claimDetails = (await publicClient.readContract({
        address: GAME_CONTRACT_BSC_ADDRESS,
        abi: gameAbi,
        functionName: "getPendingRewards",
        args: [userWalletAddress],
      })) as {
        gameID: bigint;
        betNumber: bigint;
        betAmount: bigint;
        winningAmount: bigint;
      }[];

      console.log(claimDetails, "claimDetails");
      const formattedDetails = claimDetails.map(
        ({ gameID, betNumber, betAmount, winningAmount }) => {
          return {
            gameId: Number(gameID),
            betNumber: Number(betNumber),
            betAmount: +formatUnits(betAmount, USDT_DECIMALS_ON_BSC),
            winningAmount: +formatUnits(winningAmount, USDT_DECIMALS_ON_BSC),
          };
        }
      );
      console.log(formattedDetails, "formattedDetails");
      setUserClaimDetails({
        loading: false,
        info: formattedDetails,
      });
    } catch (error) {
      setUserClaimDetails({
        loading: false,
        info: [],
      });
      console.error(error);
    }
  };

  const fetchGameDetails = async () => {
    const seasonId = (await publicClient.readContract({
      address: GAME_CONTRACT_BSC_ADDRESS,
      abi: gameAbi,
      functionName: "getCurrentIDFromCurrentSeason",
      args: [gameType],
    })) as bigint;

    const gameId = (await publicClient.readContract({
      address: GAME_CONTRACT_BSC_ADDRESS,
      abi: gameAbi,
      functionName: "getGameIDFromSeason",
      args: [gameType, seasonId],
    })) as bigint;

    console.log("gameId and seasonId", { gameId, seasonId });

    setCurrentGameSeasonId({
      seasonId: Number(seasonId),
      gameId: Number(gameId),
    });

    const [isFinalized, __, winNo, minBet, totBets, noOfBets, ____, endTime] =
      (await publicClient.readContract({
        address: GAME_CONTRACT_BSC_ADDRESS,
        abi: gameAbi,
        functionName: "getGameDetails",
        args: [gameId],
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

    const minBetAmount = +formatUnits(minBet, USDT_DECIMALS_ON_BSC);
    const totalBets = +formatUnits(totBets, USDT_DECIMALS_ON_BSC);
    const numberOfBets = Number(noOfBets);
    const gameEndTime = new Date(Number(endTime) * 1000);
    const winningNumber = Number(winNo);

    const [odds, betAmounts, totBetAmount] = (await publicClient.readContract({
      address: GAME_CONTRACT_BSC_ADDRESS,
      abi: gameAbi,
      functionName: "getOddsMultipleAndBetAmount",
      args: [gameId],
    })) as [bigint[], bigint[], bigint, number];
    // 4th param should be always 24 itself for rat RatRoullete, so not gonna consider its value

    const oddBets = odds.map((odd, index) => {
      return {
        odd: Number(odd) / 10000, // 10000 is the precision
        betAmount: +formatUnits(betAmounts[index], USDT_DECIMALS_ON_BSC),
        value: index + 1,
      };
    });

    const totalBetAmount = +formatUnits(totBetAmount, USDT_DECIMALS_ON_BSC);

    setGameDetails({
      isFinalized,
      winningNumber,
      minBetAmount,
      totalBets,
      numberOfBets,
      gameEndTime,
      oddBets,
      totalBetAmount,
    });

    setIsTimeEnded(new Date(gameEndTime) <= new Date());

    console.log(gameDetails, "gameDetails");
  };

  const fetchUserBets = async () => {
    if (!userWalletAddress) {
      setUserBetInfo([]);
      return;
    }
    const [userBetNumbers, userBetAmounts, winNumber, winningAmount] =
      (await publicClient.readContract({
        address: GAME_CONTRACT_BSC_ADDRESS,
        abi: gameAbi,
        functionName: "getUserHistory",
        args: [currentGameSeasonId.gameId, userWalletAddress],
      })) as [bigint[], bigint[], bigint, bigint];

    setUserBetInfo(
      userBetNumbers.map((betNumber: bigint, index: number) => ({
        betNumber: Number(betNumber),
        betAmount: +formatUnits(userBetAmounts[index], USDT_DECIMALS_ON_BSC),
      }))
    );
  };

  useEffect(() => {
    fetchGameDetails();
    setPageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUserBets();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userWalletAddress, currentGameSeasonId.gameId]);

  //   const renderer = ({
  //     days,
  //     hours,
  //     minutes,
  //     seconds,
  //     completed,
  //   }: {
  //     days: number;
  //     hours: number;
  //     minutes: number;
  //     seconds: number;
  //     completed: boolean;
  //   }) => {
  //     if (completed) {
  //       setIsTimeEnded(true);
  //     } else {
  //       // Render a countdown
  //       return (
  //         <div className="mt-8 lg:mt-0 gap-1 items-baseline text-white leading-none">
  //           <div className="font-outline lg:font-outline-2 text-2xl">
  //             <span className="min-w-20">{days < 10 ? `0${days}` : days}</span>.
  //             {hours < 10 ? `0${hours}` : hours}.
  //             {minutes < 10 ? `0${minutes}` : minutes}.
  //             {seconds < 10 ? `0${seconds}` : seconds}
  //           </div>
  //           <div className="text-black text-xs">Until the next draw</div>
  //         </div>
  //       );
  //     }
  //   };

  const scrollToYourBets = () => {
    if (yourBetsRef?.current) {
      yourBetsRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const claimReward = async () => {
    setIsLoading(true);
    try {
      const { request } = await publicClient.simulateContract({
        account: userWalletAddress,
        address: GAME_CONTRACT_BSC_ADDRESS,
        abi: gameAbi,
        functionName: "claimRewards",
        args: [],
        // value: parseUnits(
        // 	cart.reduce((acc, ele) => acc + ele.usdValue, 0).toString(),
        // 	6
        // ),
      });

      const walletClient = createWalletClient({
        chain: bsc,
        transport: custom(window.ethereum),
      });
      await walletClient.addChain({ chain: bsc });
      await walletClient.switchChain({ id: bsc.id });
      const hash = await walletClient.writeContract(request).catch((error) => {
        console.error(error);
        throw error;
      });
      if (hash) {
        await publicClient.waitForTransactionReceipt({
          hash,
        });
        fetchGameDetails();
        getClaimDetails();
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!pageLoaded) return null; // to avoid hydration issue

  return (
    <CartProvider initialCart={[]}>
      <main
        className={`min-h-screen relative px-4 lg:px-0 ${luckiestGuyFont.className}`}
      >
        <PreviousWinsBar currentGameSeasonId={currentGameSeasonId} />
        <div
          style={{
            backgroundImage: `url(${NetVector1.src})`,
            backgroundSize: "100% 80%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <HeaderSection />

          <BuyTilesModal
            isOpen={isBuyTileModal}
            // isLowBalance={true}
            isTimeEnded={isTimeEnded}
            gameDetails={gameDetails}
            userBetInfo={userBetInfo}
            close={() => setIsBuyTileModal(false)}
            setIsOpenTrue={() => setIsBuyTileModal(true)}
            currentGameSeasonId={currentGameSeasonId}
            userWalletAddress={userWalletAddress}
            fetchGameDetails={fetchGameDetails}
            fetchUserBets={fetchUserBets}
            scrollToYourBets={scrollToYourBets}
          />

          <HeroSection />
          <section className="container mx-auto mt-8 relative">
            {isTimeEnded ? (
              <>
                <div
                  className={
                    gameDetails.isFinalized
                      ? "grid lg:grid-cols-2 gap-4"
                      : "w-1/2 mx-auto"
                  }
                >
                  <div>
                    <iframe
                      src={`https://www.youtube.com/embed/VyDIXb6MJ6c?autoplay=1&mute=1&loop=1&playlist=VyDIXb6MJ6c`}
                      height="384px"
                      width="100%"
                      style={{
                        borderRadius: "1rem",
                        border: "2px solid black",
                        borderBottomWidth: "6px",
                      }}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                    <div className="px-2 pt-4">
                      Money Games | Hamstu Roulette | teaser
                    </div>
                  </div>

                  {gameDetails.isFinalized && (
                    <>
                      {" "}
                      <div
                        className="z-20 absolute rounded-2xl text-center bg-lightRed px-4 pt-6 pb-4 font-outline border-2 border-black border-b-[6px]"
                        style={{ left: "45%", top: "20%" }}
                      >
                        <div className="absolute inset-0">
                          <img
                            src={Confetti.src}
                            alt="Celebration"
                            className="object-cover"
                            style={{
                              width: "130%",
                              height: "130%",
                              marginTop: -20,
                            }}
                          />
                        </div>
                        <div className="relative">
                          <div className="uppercase text-primary text-4xl">
                            winner
                          </div>
                          <div className="text-6xl text-white">
                            {gameDetails.winningNumber}
                          </div>
                        </div>
                      </div>
                      <PlaceBetModalSection
                        setIsBuyTileModal={() => setIsBuyTileModal(true)}
                        gameDetails={gameDetails}
                        gameId={currentGameSeasonId.gameId}
                        isTimeEnded={isTimeEnded}
                      />
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <iframe
                    src={`https://www.youtube.com/embed/VyDIXb6MJ6c?autoplay=1&mute=1&loop=1&playlist=VyDIXb6MJ6c`}
                    height="384px"
                    width="100%"
                    style={{
                      borderRadius: "1rem",
                      border: "2px solid black",
                      borderBottomWidth: "6px",
                    }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                  <div className="px-2 pt-4">
                    Money Games | Hamstu Roulette | teaser
                  </div>
                </div>
                <PlaceBetModalSection
                  setIsBuyTileModal={() => setIsBuyTileModal(true)}
                  gameDetails={gameDetails}
                  gameId={currentGameSeasonId.gameId}
                  isTimeEnded={isTimeEnded}
                />
              </div>
            )}
          </section>
        </div>
        {!isTimeEnded && (
          <CountDownSection targetDate={new Date(gameDetails.gameEndTime)} />
        )}

        {userWalletAddress ? (
          <section className="container mx-auto my-24">
            <div className="text-tertiary text-4xl font-outline text-center">
              Are you a winner?
            </div>
            <div className="flex justify-center mt-8">
              {!isCheckRewards ? (
                <Button
                  extraClassName="text-xl px-16 pt-3 pb-1"
                  onClick={() => {
                    getClaimDetails();
                    setIsCheckRewards(true);
                  }}
                >
                  Check Now
                </Button>
              ) : (
                <>
                  {userClaimDetails.loading ? (
                    <div className="text-xl text-center w-1/4 uppercase">
                      Checking your rewards...
                    </div>
                  ) : userClaimDetails.info.length ? (
                    <div className="w-full lg:w-2/3">
                      <div className="grid grid-cols-4 text-center gap-4 pb-4 px-5">
                        <div>Season</div>
                        <div>Number</div>
                        <div>Bet Amount</div>
                        <div>Prize</div>
                      </div>
                      {userClaimDetails.info.map(
                        (
                          { gameId, betNumber, betAmount, winningAmount },
                          index
                        ) => {
                          return (
                            <div
                              key={gameId}
                              className="text-white border-2 border-b-[6px] border-black bg-tertiary rounded-xl p-5 mb-4 mx-auto w-full grid grid-cols-4 items-center text-2xl"
                            >
                              <div className="text-center uppercase">
                                Season {gameId}
                              </div>
                              <div className="relative">
                                <div
                                  className={`-rotate-6 text-5xl w-28 h-28 absolute -top-14 left-1/2 -translate-x-1/2 rounded-lg border-2 border-black border-b-[6px] flex items-center justify-center pt-2 ${
                                    betNumber % 2 === 0
                                      ? "bg-black"
                                      : "bg-lightRed"
                                  }`}
                                >
                                  {betNumber}
                                </div>
                              </div>
                              <div className="flex justify-center items-center gap-2 text-2xl pt-2">
                                <Image
                                  alt="Coin"
                                  src={GreenCoinSvg}
                                  width={24}
                                  height={24}
                                />
                                ${betAmount}
                              </div>
                              <div className="flex justify-center items-center gap-2 text-4xl text-[#b8fa2c] font-outline">
                                <Image
                                  alt="Coin"
                                  src={StarSvg}
                                  width={32}
                                  height={32}
                                />
                                <div className="pt-3">${winningAmount}</div>
                              </div>
                            </div>
                          );
                        }
                      )}
                      <div className="w-1/3 mx-auto mt-12">
                        <Button
                          isDisabled={
                            !userClaimDetails.info.length || isLoading
                          }
                          extraClassName="text-xl lg:text-2xl !p-8 !pt-4 !pb-2 uppercase w-full"
                          onClick={() => {
                            claimReward();
                          }}
                        >
                          {isLoading ? "Claiming..." : "Claim All"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xl text-center w-1/4 uppercase">
                      There are no prizes to be Claimed this time Better luck
                      next time!
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        ) : null}

        {
          /* <ClaimRewardSection /> */
          // gameDetails.
        }

        <HistorySection
          gameId={currentGameSeasonId.gameId}
          winningNumber={gameDetails.winningNumber}
          gameDetails={gameDetails}
        />

        <FAQ game="rat-roullete" />

        <Footer />
      </main>
    </CartProvider>
  );
};

export default RatRoullete;
