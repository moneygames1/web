'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import addIcon from '../assets/images/add.svg';
import removeIcon from '../assets/images/remove.svg';
import Button from './Button';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import gameAbi from '@/helpers/abis/game.json';
import coin10 from '../assets/images/10-coin.svg';
import coin20 from '../assets/images/20-coin.svg';
import coin50 from '../assets/images/50-coin.svg';
import coin100 from '../assets/images/100-coin.svg';
import {
	GAME_CONTRACT_BSC_ADDRESS,
	USDT_CONTRACT_ADDRESS,
	USDT_DECIMALS_ON_BSC
} from '@/helpers/constants';
import { publicClient } from './Web3Provider';

type BuyModalProps = {
	betNumberDetails: {
		value: number;
		betAmount: number;
		odd: number;
	};
	gameId: number;
	totalBets: number;
	minBetAmount: number;
	isOpen: boolean;
	currentValue?: number;
	close: () => void;
	addToCart: (value: number) => void;
};

const BuyGameModal = ({
	betNumberDetails,
	minBetAmount,
	totalBets,
	isOpen,
	gameId,
	currentValue,
	close,
	addToCart,
}: BuyModalProps) => {
	const [value, setValue] = useState(currentValue || 10);

	const { address } = useAccount();
	const balance = useBalance({
		address,
		token: USDT_CONTRACT_ADDRESS,
	}).data;
	const [potentialReturns, setPotentialReturns] = useState({
		loading: true,
		value: 0,
	});

	const getPotentialReturns = async () => {
		setPotentialReturns({ ...potentialReturns, loading: true });
		const returns = (await publicClient.readContract({
			address: GAME_CONTRACT_BSC_ADDRESS,
			abi: gameAbi,
			functionName: 'getPotentialReward',
			args: [
				gameId,
				betNumberDetails.value,
				parseUnits(value.toString(), USDT_DECIMALS_ON_BSC),
			],
		})) as bigint;
		const formattedReturns = +formatUnits(returns, USDT_DECIMALS_ON_BSC);

		setPotentialReturns({
			loading: false,
			value: Number(Number(formattedReturns.toFixed(2)).toFixed(2)),
		});
	};

	useEffect(() => {
		if (isOpen) {
			getPotentialReturns();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, betNumberDetails.value, isOpen]);

	useEffect(() => {
		return () => {
			setValue(currentValue || 10);
		};
	}, [currentValue, isOpen]);

	const isLowBalance =
		+formatUnits(balance?.value || (0 as unknown as bigint), USDT_DECIMALS_ON_BSC) < value;

	const isMinimumBet = value < minBetAmount;
	const estimatedWinnings =
		betNumberDetails.odd === 0
			? totalBets + value
			: value * betNumberDetails.odd;

	if (!isOpen) {
		return null;
	}

	return (
		<div>
			<div
				className="overflow-y-auto overflow-x-hidden fixed inset-0 z-40 w-full h-full max-h-full bg-primary/80"
				onClick={close}
			/>
			<div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-tertiary border-2 border-black border-b-[6px] rounded-lg">
				<div
					className={`absolute top-0 left-[50%] -translate-x-1/2 -translate-y-1/2 z-50 h-20 w-20 flex justify-center items-center pt-4 border border-black border-b-4 rounded-2xl ${
						true ? 'bg-lightRed' : 'bg-black'
					}`}
				>
					<span className="text-white font-outline-2 text-6xl">
						{betNumberDetails.value}
					</span>
				</div>

				<div className="text-center text-white mt-16 text-xl">
					Total Wagers{' '}
					<span className="font-outline text-2xl pl-2">
						${betNumberDetails.betAmount}
					</span>
				</div>

				<div className="pt-8 pb-16 px-8">
					<div className="text-center text-white flex justify-between items-center bg-[#623AA6] py-8 rounded-2xl px-4">
						<button
							onClick={() => {
								if (value > minBetAmount) {
									setValue(value - 1);
								}
							}}
							className="p-4 hover:scale-110"
						>
							<Image
								src={removeIcon}
								width={40}
								height={40}
								alt="-"
							/>
						</button>
						<input
							className="text-6xl pt-4 w-2/3 outline-none mx-auto bg-transparent text-center text-white"
							value={value}
							step={minBetAmount}
							min={minBetAmount}
							type="number"
							maxLength={8}
							onChange={(e) => {
								setValue(+e.target.value);
							}}
						/>
						<button
							onClick={() => {
								setValue(value + 1);
							}}
							className="p-4 hover:scale-110"
						>
							<Image
								src={addIcon}
								width={40}
								height={40}
								alt="+"
							/>
						</button>
					</div>

					<div className="grid grid-cols-4 gap-4 mt-8">
						{[
							{
								src: coin10.src,
								addValue: 10,
							},
							{
								src: coin20.src,
								addValue: 20,
							},
							{
								src: coin50.src,
								addValue: 50,
							},
							{
								src: coin100.src,
								addValue: 100,
							},
						].map(({ src, addValue }, index) => (
							<button
								key={index}
								onClick={() => {
									setValue(value + addValue);
								}}
								className="rounded-full coin-shadow hover:scale-110"
							>
								<Image
									src={src}
									width={100}
									height={100}
									alt={value.toString()}
								/>
							</button>
						))}
					</div>

					<div className="text-center text-white mt-8 text-xl pb-4 uppercase">
						<div>Estimated winnings</div>
						{potentialReturns.loading ? (
							<svg
								className="animate-spin mx-auto h-8 w-8 text-[#b8fa2c]"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-50"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						) : (
							<div className="font-outline text-3xl pl-2 text-[#b8fa2c]">
								${potentialReturns.value}
							</div>
						)}
					</div>

					<div className="flex justify-center">
						<Button
							extraClassName="absolute -bottom-4 text-2xl w-3/4 pt-4 pb-2"
							onClick={() => {
								addToCart(value);
								close();
							}}
							isDisabled={isLowBalance || isMinimumBet}
						>
							{isLowBalance ? (
								<span className="absolute -top-4 bg-red-500 text-sm px-2 pt-1 rounded -right-4 text-white font-outline border border-b-4 border-black">
									Low Balance
								</span>
							) : null}
							Continue
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BuyGameModal;
