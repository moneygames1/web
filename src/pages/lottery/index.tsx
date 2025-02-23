'use client';

import Button from '@/components/Button';
import { ConnectKitButton } from 'connectkit';
import Image from 'next/image';

import LogoSvg from '../../assets/images/logo.svg';
import TelegramSvg from '../../assets/images/telegram.svg';
import TwitterSvg from '../../assets/images/twitter.svg';
import StarsBg from '../../assets/images/stars-bg.png';
import NetVector1 from '../../assets/images/net-vector1.svg';
import { Luckiest_Guy } from 'next/font/google';
import Countdown from 'react-countdown';
import Footer from '@/components/Footer';
import { publicClient } from '@/components/Web3Provider';

import lotteryAbi from '@/helpers/abis/lottery.json';
import { useAccount } from 'wagmi';
import { createWalletClient, custom, formatEther, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';

import BuyLotteryModal from '@/components/BuyLotteryModal';
import { useEffect, useRef, useState } from 'react';
import YourTicketSection from '@/components/Lottery/YourTickets';
import { FAQ } from '@/components/Faq';
import { LOTTERY_CONTRACT_ADDRESS } from '@/helpers/constants';
import Link from 'next/link';

const luckiestGuyFont = Luckiest_Guy({
	weight: '400',
	subsets: ['latin'],
});

export default function Home() {
	const { address: userWalletAddress } = useAccount();
	const [isBuyModal, setIsBuyModal] = useState(false);
	const [userClaimDetails, setUserClaimDetails] = useState<{
		loading: boolean;
		info: {
			lotteryId: number;
			ticketId: number;
			nftId: number;
			position: number;
			reward: number;
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

	const [isCheckRewards, setIsCheckRewards] = useState(false);

	// Renderer callback with condition
	const renderer = ({
		days,
		hours,
		minutes,
		seconds,
		completed,
	}: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
		completed: boolean;
	}) => {
		if (completed) {
			// Render a completed state
			return <span>You are good to go!</span>;
		} else {
			// Render a countdown
			return (
				<div>
					<div className="text-3xl lg:text-6xl text-white font-outline lg:font-outline-2 leading-none">
						<span className="min-w-20">
							{days < 10 ? `0${days}` : days}
						</span>{' '}
						. {hours < 10 ? `0${hours}` : hours} .{' '}
						{minutes < 10 ? `0${minutes}` : minutes} .{' '}
						{seconds < 10 ? `0${seconds}` : seconds}
					</div>
					<div className="text-lg lg:text-2xl uppercase text-white font-outline flex justify-between -mt-2 px-1">
						days <span className="ml-4">hrs</span>{' '}
						<span className="ml-4">mins</span>{' '}
						<span className="ml-4">secs</span>
					</div>
					<div className="text-center mt-4">Until the next draw</div>
				</div>
			);
		}
	};

	const [isLoading, setIsLoading] = useState(false);
	const yourBetsRef = useRef<HTMLDivElement>(null);
	const [currentLotteryId, setCurrentLotteryId] = useState(1);
	const [lotteryInfo, setLotteryInfo] = useState<{
		isCancelled: boolean;
		isRewardCalculated: boolean;
		ticketPrice: bigint;
		totalTickets: bigint;
		currentTickets: bigint;
		lotteryEndTime: bigint;
		buckets: bigint[];
		rewards: bigint[];
		totalReward: bigint;
	}>({
		isCancelled: false,
		isRewardCalculated: false,
		ticketPrice: BigInt(0),
		totalTickets: BigInt(0),
		currentTickets: BigInt(0),
		lotteryEndTime: BigInt(0),
		buckets: [],
		rewards: [],
		totalReward: BigInt(0),
	});

	const fetchlotteryDetails = async () => {
		const lotteryId = (await publicClient.readContract({
			address: LOTTERY_CONTRACT_ADDRESS,
			abi: lotteryAbi,
			functionName: 'currentLotteryID',
		})) as number;
		setCurrentLotteryId(Number(lotteryId));

		const [
			isCancelled,
			isRewardCalculated,
			ticketPrice,
			totalTickets,
			currentTickets,
			lotteryEndTime,
		] = (await publicClient.readContract({
			address: LOTTERY_CONTRACT_ADDRESS,
			abi: lotteryAbi,
			functionName: 'getLotteryDetails',
			args: [Number(lotteryId) - 1],
		})) as [boolean, boolean, bigint, bigint, bigint, bigint];

		const [buckets, rewards, _, totalReward] =
			(await publicClient.readContract({
				address: LOTTERY_CONTRACT_ADDRESS,
				abi: lotteryAbi,
				functionName: 'getLotteryRewardDetails',
				args: [Number(lotteryId) - 1],
			})) as [bigint[], bigint[], unknown, bigint];

		setLotteryInfo({
			isCancelled,
			isRewardCalculated,
			ticketPrice,
			totalTickets,
			currentTickets,
			lotteryEndTime,
			buckets,
			rewards,
			totalReward,
		});
	};

	useEffect(() => {
		fetchlotteryDetails();
	}, []);

	const {
		isCancelled,
		isRewardCalculated,
		ticketPrice,
		totalTickets,
		currentTickets,
		lotteryEndTime,
		buckets,
		rewards,
		totalReward,
	} = lotteryInfo;

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
				address: LOTTERY_CONTRACT_ADDRESS,
				abi: lotteryAbi,
				functionName: 'getPendingRewards',
				args: [userWalletAddress],
			})) as {
				lotteryID: bigint;
				ticketID: bigint;
				nftID: bigint;
				position: bigint;
				reward: bigint;
			}[];

			const formattedDetails = claimDetails.map(
				({ lotteryID, ticketID, nftID, position, reward }) => {
					return {
						lotteryId: Number(lotteryID) + 1,
						ticketId: Number(ticketID) + 1,
						nftId: Number(nftID),
						position: Number(position),
						reward: +formatEther(reward),
					};
				}
			);

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

	const scrollToYourBets = () => {
		if (yourBetsRef?.current) {
			yourBetsRef?.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

	const participateLottery = async (quantity = 1) => {
		setIsLoading(true);
		try {
			const { request } = await publicClient.simulateContract({
				account: userWalletAddress,
				address: LOTTERY_CONTRACT_ADDRESS,
				abi: lotteryAbi,
				functionName: 'participateLottery',
				args: [currentLotteryId - 1, quantity],
				value: parseEther(
					(quantity * +formatEther(ticketPrice)).toString()
				),
			});

			const walletClient = createWalletClient({
				chain: baseSepolia,
				transport: custom(window.ethereum),
			});
			await walletClient.addChain({ chain: baseSepolia });
			await walletClient.switchChain({ id: baseSepolia.id });
			const hash = await walletClient
				.writeContract(request)
				.catch((error) => {
					console.error(error);
				});

			if (hash) {
				await publicClient.waitForTransactionReceipt({
					hash,
				});
				closeBuyModal();
				scrollToYourBets();
				fetchlotteryDetails();
				fetchCurrentLotteryTickets();
			}
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const claimReward = async () => {
		setIsLoading(true);
		try {
			const { request } = await publicClient.simulateContract({
				account: userWalletAddress,
				address: LOTTERY_CONTRACT_ADDRESS,
				abi: lotteryAbi,
				functionName: 'claimRewards',
				args: [],
			});

			const walletClient = createWalletClient({
				chain: baseSepolia,
				transport: custom(window.ethereum),
			});
			await walletClient.addChain({ chain: baseSepolia });
			await walletClient.switchChain({ id: baseSepolia.id });
			const hash = await walletClient
				.writeContract(request)
				.catch((error) => {
					console.error(error);
					throw error;
				});
			if (hash) {
				await publicClient.waitForTransactionReceipt({
					hash,
				});
				getClaimDetails();
				setIsLoading(false);
			}
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const [tickets, setTickets] = useState<{
		loading: boolean;
		info: {
			ticket: object;
			nftTicket: string;
			participationIndex: number;
		}[];
	}>({
		loading: false,
		info: [],
	});

	const fetchCurrentLotteryTickets = async () => {
		setTickets({
			loading: true,
			info: [],
		});
		if (!userWalletAddress) {
			setTickets({
				loading: false,
				info: [],
			});
			return;
		}
		try {
			if (!currentLotteryId) return;
			// Fetch tickets for the current lottery
			let participationIndex = 0;
			const ticketsPush = [];
			let end = false;
			while (!end) {
				try {
					console.log(
						'fetchCurrentLotteryTickets while loop',
						participationIndex
					);
					const ticket = await publicClient.readContract({
						address: LOTTERY_CONTRACT_ADDRESS,
						abi: lotteryAbi,
						functionName: 'userDetails',
						args: [
							userWalletAddress,
							currentLotteryId - 1,
							participationIndex,
						],
					});
					if (!ticket) {
						end = true;
						break;
					}
					const nftTicket = await publicClient.readContract({
						address: LOTTERY_CONTRACT_ADDRESS,
						abi: lotteryAbi,
						functionName: 'tokenURI',
						args: [ticket],
					});

					ticketsPush.push({
						ticket,
						nftTicket,
						participationIndex,
					});

					participationIndex++;
				} catch (error) {
					end = true;
					console.error(error);
				}
			}
			setTickets({
				loading: false,
				info: ticketsPush as any,
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchCurrentLotteryTickets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userWalletAddress, currentLotteryId]);

	return (
		<main className={`min-h-screen relative ${luckiestGuyFont.className}`}>
			<BuyLotteryModal
				ticketPrice={+formatEther(ticketPrice || BigInt(0))}
				isOpen={isBuyModal}
				close={closeBuyModal}
				isLoading={isLoading}
				buyTicket={participateLottery}
				maxTickets={Number(totalTickets) - Number(currentTickets)}
			/>
			<header className="p-8 flex justify-between items-center container mx-auto z-10">
				<div>
					<Link href="/">
						<Image src={LogoSvg} alt="Money.Games" width={80} />
					</Link>
				</div>
				<div className="flex gap-4">
					<div className="hidden lg:flex gap-4 mr-8 ">
						<a
							href="https://t.me/themoney_games"
							rel="noopener noreferrer"
							target="_blank"
						>
							<Image
								src={TelegramSvg}
								alt="Telegram"
								width={40}
							/>
						</a>
						<a
							href="https://x.com/the_money_games"
							rel="noopener noreferrer"
							target="_blank"
						>
							<Image src={TwitterSvg} alt="Twitter" width={40} />
						</a>
					</div>

					<div>
						<ConnectKitButton.Custom>
							{({
								isConnected,
								isConnecting,
								show,
								hide,
								address,
								ensName,
								chain,
								truncatedAddress,
							}) => {
								return (
									<Button
										onClick={show}
										extraClassName="text-sm lg:text-base"
									>
										{isConnected
											? truncatedAddress
											: 'Connect Wallet'}
									</Button>
								);
							}}
						</ConnectKitButton.Custom>
					</div>
				</div>
			</header>
			<div
				style={{
					backgroundImage: `url(${NetVector1.src})`,
					backgroundSize: '100% 80%',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<section>
					<div className="container mx-auto">
						<div className="flex justify-center pt-20">
							<div
								className="w-fit"
								style={{
									backgroundImage: `url(${StarsBg.src})`,
									backgroundSize: 'contain',
									backgroundRepeat: 'no-repeat',
								}}
							>
								<h1 className="text-6xl lg:text-[10rem] text-tertiary font-outline-3 uppercase text-center lg:leading-[8rem] ">
									Win
									<br /> {+formatEther(totalReward)} ETH
								</h1>
							</div>
						</div>
						<div className="flex flex-col justify-center items-center mt-8">
							<Button
								extraClassName="text-xl lg:text-3xl !p-16 !pt-4 !pb-2 "
								isDisabled={
									isCancelled ||
									isRewardCalculated ||
									totalTickets === currentTickets
								}
								onClick={openBuyModal}
							>
								{totalTickets === currentTickets ? (
									<span className="absolute -top-4 bg-red-500 text-sm px-2 pt-1 rounded -right-4 text-white font-outline border border-b-4 border-black">
										Sold out
									</span>
								) : null}
								Buy Tickets
							</Button>
							<div className="mt-16 text-2xl">
								<span className="text-white font-outline text-3xl">
									{Number(currentTickets)}
								</span>{' '}
								out of{' '}
								<span className="text-white font-outline text-3xl">
									{Number(totalTickets)}
								</span>{' '}
								tickets are sold
							</div>
							{lotteryEndTime ? (
								<div className="mt-12">
									<Countdown
										date={
											new Date(
												Number(lotteryEndTime) * 1000
											)
										}
										renderer={renderer}
									/>
								</div>
							) : null}
						</div>
					</div>
				</section>
				<section
					className="container mx-auto m-4 lg:m-20"
					ref={yourBetsRef}
				>
					<YourTicketSection
						currentLotteryId={currentLotteryId}
						buckets={buckets}
						rewards={rewards}
						openBuyModal={openBuyModal}
						endTime={Number(lotteryEndTime)}
						tickets={tickets}
					/>
				</section>
			</div>
			<section className="container mx-auto my-32">
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
										<div>Position</div>
										<div>Ticket No</div>
										<div>Prize</div>
									</div>
									{userClaimDetails.info.map(
										(
											{
												lotteryId,
												ticketId,
												reward,
												nftId,
												position,
											},
											index
										) => {
											return (
												<div
													key={nftId}
													className="text-black border-2 border-b-[6px] border-black bg-pinky rounded-xl p-5 mb-4 mx-auto w-full grid grid-cols-4 items-center text-2xl"
												>
													<div className="text-center uppercase">
														Season {lotteryId}
													</div>
													<div className="text-center uppercase">
														{position + 1}
													</div>
													<div className="text-center uppercase">
														MGS{lotteryId}0
														{ticketId}
													</div>
													<div className="text-center uppercase font-outline text-2xl text-white">
														{reward} ETH
													</div>
												</div>
											);
										}
									)}
									<div className="w-1/3 mx-auto mt-12">
										<Button
											isDisabled={
												!userClaimDetails.info.length ||
												isLoading
											}
											extraClassName="text-xl lg:text-2xl !p-8 !pt-4 !pb-2 uppercase w-full"
											onClick={() => {
												claimReward();
											}}
										>
											{isLoading
												? 'Claiming...'
												: 'Claim All'}
										</Button>
									</div>
								</div>
							) : (
								<div className="text-xl text-center w-1/4 uppercase">
									There are no prizes to be Claimed this time
									Better luck next time!
								</div>
							)}
						</>
					)}
				</div>
			</section>
			<FAQ game="lottery" />

			<Footer />
		</main>
	);
}
