"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import GreenCoinSvg from ".././assets/images/green-coin.svg";
import StarSvg from ".././assets/images/star.svg";
import CloseSvg from ".././assets/images/close.svg";
import InfinitySvg from ".././assets/images/infinty.svg";
import BuyGameModal from "./BuyGameModal";
import { publicClient } from "@/components/Web3Provider";
import {
  GAME_CONTRACT_BSC_ADDRESS,
  GAME_TYPE,
  USDT_CONTRACT_ADDRESS,
} from "@/helpers/constants";
import {
  createWalletClient,
  custom,
  erc20Abi,
  formatUnits,
  parseUnits,
} from "viem";
import { baseSepolia, bsc } from "viem/chains";
import gameAbi from "@/helpers/abis/game.json";
import Button from "./Button";
import { useBalance } from "wagmi";
import { useCart } from "@/hooks/UseCartContext";
import Snackbar from "./SnackBar";

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

type UserBetInfo = {
  betNumber: number;
  betAmount: number;
};

type CurrentGameSeasonId = {
  seasonId: number;
  gameId: number;
};

type BuyTilesModalProps = {
  gameDetails: GameDetails;
  userBetInfo: Array<UserBetInfo>;
  currentGameSeasonId: CurrentGameSeasonId;
  userWalletAddress: `0x${string}` | undefined;
  isOpen: boolean;
  //   isLowBalance: boolean;
  isTimeEnded: boolean;
  close: () => void;
  setIsOpenTrue: () => void;
  fetchGameDetails: () => void;
  fetchUserBets: () => void;
  scrollToYourBets: () => void;
};

const BuyTilesModal = ({
  gameDetails,
  userBetInfo,
  currentGameSeasonId,
  userWalletAddress,
  isOpen,
  isTimeEnded,
  setIsOpenTrue,
  close,
  fetchGameDetails,
  fetchUserBets,
  scrollToYourBets,
}: BuyTilesModalProps) => {
  const [betNumberDetails, setBetNumberDetails] = useState({
    value: 0,
    betAmount: 0,
    odd: 1,
  });
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success" as "success" | "error",
    isVisible: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBuyModal, setIsBuyModal] = useState(false);
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    placeOrder,
    setOrderedPlaced,
  } = useCart();

  const balance = useBalance({
    address: userWalletAddress,
    token: USDT_CONTRACT_ADDRESS,
  }).data;

  useEffect(() => {
    (async () => {
      try {
        if (isTimeEnded) {
          setOrderedPlaced([]);
          return;
        }
        const [userBetNumbers, userBetAmounts, winNumber, winningAmount] =
          (await publicClient.readContract({
            address: GAME_CONTRACT_BSC_ADDRESS,
            abi: gameAbi,
            functionName: "getUserHistory",
            args: [currentGameSeasonId.gameId, userWalletAddress],
          })) as [bigint[], bigint[], bigint, bigint];
        console.log("userDetails in tile modal", {
          userBetNumbers,
          userBetAmounts,
          winNumber,
          winningAmount,
        });

        setOrderedPlaced(
          userBetNumbers.map((betNumber: bigint, index: number) => ({
            betNumber: Number(betNumber),
            usdValue: +formatUnits(userBetAmounts[index], 6),
          }))
        );
      } catch (e) {
        console.log("error while fetching user bets", e);
      }
    })();
  }, [currentGameSeasonId]);

  const openBuyModal = () => {
    setIsBuyModal(true);
  };

  const closeBuyModal = () => {
    setIsBuyModal(false);
    // close();
  };

  const placeBet = async () => {
    setIsLoading(true);
    try {
      const approvedAmount = await publicClient.readContract({
        address: USDT_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: [userWalletAddress as `0x${string}`, GAME_CONTRACT_BSC_ADDRESS],
      });

      if (
        +formatUnits(approvedAmount, 6) <
        cart.reduce((acc, ele) => acc + ele.usdValue, 0)
      ) {
        const { request } = await publicClient.simulateContract({
          account: userWalletAddress,
          address: USDT_CONTRACT_ADDRESS,
          abi: erc20Abi,
          functionName: "approve",
          args: [GAME_CONTRACT_BSC_ADDRESS, parseUnits("10000", 6)],
        });
        const walletClient = createWalletClient({
          chain: bsc,
          transport: custom(window.ethereum),
        });
        await walletClient.addChain({ chain: bsc });
        await walletClient.switchChain({ id: bsc.id });
        console.log(request, "request");
        const hash = await walletClient
          .writeContract(request)
          .catch((error) => {
            console.error(error);
            throw error;
          });

        console.log(hash, "hash");
        if (hash) {
          await publicClient.waitForTransactionReceipt({
            hash,
          });
        }
      }

      const { request } = await publicClient.simulateContract({
        account: userWalletAddress,
        address: GAME_CONTRACT_BSC_ADDRESS,
        abi: gameAbi,
        functionName: "placeBet",
        args: [
          currentGameSeasonId.gameId,
          cart.map((ele) => ele.betNumber),
          cart.map((ele) => parseUnits(ele.usdValue.toString(), 6)),
        ],
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
        fetchUserBets();
        clearCart();
        placeOrder();
        scrollToYourBets();
        setIsLoading(false);
        setSnackbar({
          message: "Transaction Completed Successfully!!",
          type: "success",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("error in placeBet", error);
      setIsLoading(false);
      setSnackbar({
        message: "Something Went Wrong",
        type: "error",
        isVisible: true,
      });
    }
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isVisible: false }));
  };

  const BoxNumber = useCallback(
    ({
      data,
    }: {
      data: {
        odd: number;
        betAmount: number;
        value: number;
      };
    }) => {
      const isRed = data.value % 2 === 0;
      return (
        <button
          className="hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-80"
          onClick={() => {
            setBetNumberDetails(data);
            openBuyModal();
          }}
          // disabled={isTimeEnded}
        >
          <div
            className={`relative px-2 w-full h-full rounded-xl border-2 border-black border-b-[6px] text-center ${
              isRed ? "bg-lightRed" : "bg-black"
            }`}
          >
            {/* <div className="text-2xl text-primary font-outline pt-2 flex justify-center items-center gap-1">
              {data.odd === 0 ? (
                <Image
                  src={InfinitySvg}
                  alt="Infinity"
                  width={32}
                  className="-mt-1"
                />
              ) : (
                data.odd.toFixed(1)
              )}
              x
            </div> */}
            <div className="text-6xl text-white font-outline-2 pt-8 pb-4 flex flex-col items-center">
              {data.value}
              {userBetInfo.find((el) => el.betNumber === data.value) ? (
                <div className="">
                  <Image src={GreenCoinSvg} alt="Coin" width={16} />
                </div>
              ) : null}
            </div>
          </div>
        </button>
      );
    },
    [userBetInfo]
  );
  const isLowBalance =
    +formatUnits(balance?.value || (0 as unknown as bigint), 6) <
    cart.reduce((acc, ele) => acc + ele.usdValue, 0);

  if (!isOpen) return null;
  if (isBuyModal)
    return (
      <BuyGameModal
        betNumberDetails={betNumberDetails}
        totalBets={gameDetails.totalBets}
        isOpen={isBuyModal}
        close={closeBuyModal}
        gameId={currentGameSeasonId.gameId}
        currentValue={
          cart?.find((ele) => ele.betNumber === betNumberDetails.value)
            ?.usdValue
        }
        minBetAmount={gameDetails.minBetAmount}
        addToCart={(usdValue) => {
          //   if (cart.find((ele) => ele.betNumber === betNumberDetails.value)) {
          //     console.log("current cart", cart);

          //     const index = cart.findIndex(
          //       (ele) => ele.betNumber === betNumberDetails.value
          //     );
          //     const newCart = [...cart];
          //     console.log("new cart", newCart);

          //     newCart[index].usdValue = usdValue;
          //     addToCart(newCart[index]); // Use context API to update cart
          //     return;
          //   }
          addToCart({
            betNumber: betNumberDetails.value,
            usdValue,
          });
        }}
      />
    );
  return (
    <div>
      <div
        className="overflow-y-auto overflow-x-hidden fixed inset-0 z-40 w-full h-full max-h-full bg-tertiary/80"
        onClick={close}
      />
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%]">
        <div className="text-white text-xl text-right">
          Total Game Bag so Far:{" "}
          <span className="text-[#b8fa2c] text-4xl font-outline">
            ${gameDetails.totalBets}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-8 gap-2">
          {gameDetails.oddBets
            .filter((_, index) => (index + 1) % 3 === 0)
            .map((ele, index) => {
              return <BoxNumber key={ele.value} data={ele} />;
            })}
          {gameDetails.oddBets
            .filter((_, index) => (index + 2) % 3 === 0)
            .map((ele, index) => {
              return <BoxNumber key={ele.value} data={ele} />;
            })}
          {gameDetails.oddBets
            .filter((_, index) => index % 3 === 0)

            .map((ele, index) => {
              return <BoxNumber key={ele.value} data={ele} />;
            })}
        </div>

        <div className="mt-8 border-2 border-b-[6px] p-4 rounded-xl border-black">
          <div className="text-secondary font-outline-2 text-3xl -mt-8 mb-2">
            CART
          </div>
          {cart.length ? (
            <div className="flex flex-wrap gap-4">
              {cart.map((ele) => {
                const isRed = ele.betNumber % 2 === 0;
                return (
                  <div
                    key={ele.betNumber}
                    className={`relative group px-4 pt-2 w-fit rounded-xl border-2 border-black border-b-[6px] flex gap-2 items-center justify-center ${
                      isRed ? "bg-lightRed" : "bg-black"
                    }`}
                  >
                    <button
                      className="absolute -right-1 -top-4 hidden group-hover:block p-2"
                      onClick={() => {
                        removeFromCart(ele.betNumber); // Use the context API's removeFromCart function
                      }}
                    >
                      <Image src={CloseSvg} alt="Coin" width={16} />
                    </button>
                    <div className="text-white font-outline text-3xl">
                      {ele.betNumber}
                    </div>
                    <Image src={GreenCoinSvg} alt="Coin" width={24} />
                    <div className="text-white text-3xl">${ele.usdValue}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-primary font-outline text-lg uppercase">
              Add to the cart by selecting the numbers
            </div>
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            extraClassName="text-xl lg:text-2xl !p-8 !pt-4 !pb-2 "
            onClick={placeBet}
            isDisabled={isLoading}
          >
            {isLoading ? "Placing bet..." : "Place your bet"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyTilesModal;
