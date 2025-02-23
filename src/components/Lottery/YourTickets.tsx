'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { publicClient } from '../Web3Provider';
import lotteryAbi from '@/helpers/abis/lottery.json';
import Button from '../Button';
import { formatEther } from 'viem';
import { format } from 'date-fns';
import { LOTTERY_CONTRACT_ADDRESS } from '@/helpers/constants';
import lotteryNftSvg from '@/assets/images/lottery-nft.svg';

type YourTicketSectionProps = {
	currentLotteryId: number;
	buckets: bigint[];
	rewards: bigint[];
	openBuyModal: () => void;
	endTime: number;
	tickets: {
		loading: boolean;
		info: {
			ticket: object;
			nftTicket: string;
			participationIndex: number;
		}[];
	};
};

const YourTicketSection = ({
	currentLotteryId,
	buckets,
	rewards,
	openBuyModal,
	tickets,
	endTime,
}: YourTicketSectionProps) => {
	const [togglePrizeStructure, setTogglePrizeStructure] = useState(true);

	const formattedRewards = rewards.map((reward) => +formatEther(reward));
	const formattedBucket = buckets.map((bucket) => Number(bucket));

	const prizeStructure = formattedRewards
		.map((ele: number, i: number) => {
			if (i !== 0 && formattedBucket[i] - formattedBucket[i - 1] > 1) {
				return {
					rank: `${formattedBucket[i - 1] + 1}-${formattedBucket[i]}`,
					rewards: formattedRewards[i],
				};
			}

			return {
				rank:
					formattedBucket[i] === 1
						? '1st'
						: formattedBucket[i] === 2
						? '2nd'
						: formattedBucket[i] === 3
						? '3rd'
						: `${formattedBucket[i]}th`,
				rewards: formattedRewards[i],
			};
		})
		.filter((ele) => ele.rewards);

	return (
		<div className="bg-black px-[2px] pb-1 w-4/5 lg:w-1/2 mx-auto rounded-lg">
			<div className="lg:flex justify-between text-white uppercase p-4 pb-2">
				<div className="text-lg">Season {currentLotteryId}</div>
				<div className="text-lg">
					{format(new Date((endTime || 0) * 1000), 'PPpp')}
				</div>
			</div>
			<div className="bg-tertiary rounded-b-lg relative">
				<div
					className={`p-4 ${togglePrizeStructure ? 'pb-4' : 'pb-12'}`}
				>
					{tickets.loading ? (
						<div className="mt-8 mb-16 w-1/2 mx-auto">
							<div className="text-lg text-center">
								Loading your tickets...
							</div>
						</div>
					) : (
						<>
							{tickets.info?.length ? (
								<div>
									<div className="text-blueGreen font-outline text-center text-2xl">
										Your Tickets
									</div>
									<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-8">
										{tickets.info.map((ticket, index) => {
											return (
												<div
													className={`bg-green-400 h-48 w-48 rounded-lg ${
														index % 2 === 0
															? 'rotate-2'
															: '-rotate-3'
													}`}
													key={
														ticket.participationIndex
													}
													style={{
														background: `url(${lotteryNftSvg.src})`,
														backgroundSize: 'cover',
													}}
												>
													<div className="flex h-full justify-center items-end pb-5 text-white font-outline text-xl">
														MGS{currentLotteryId}0
														{ticket.ticket.toString()}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							) : (
								<div className="mt-8 mb-16 w-1/2 mx-auto">
									<div className="text-lg text-center">
										You haven&apos;t purchased any tickets
										yet.
									</div>
									<div className="w-2/3 mx-auto">
										<Button
											extraClassName="w-full mt-4 pt-4 pb-2 text-xl"
											onClick={openBuyModal}
										>
											Buy Ticket now
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</div>

				{togglePrizeStructure ? (
					<div className="p-6 border-t-2 border-black pb-16 bg-pinky lg:grid grid-cols-3 justify-center gap-8 text-center">
						{prizeStructure.map(({ rank, rewards }) => (
							<div key={rank} className="mt-4 lg:mt-0">
								<div className="text-lg">{rank}</div>
								<div className="text-white text-3xl font-outline leading-none">
									{rewards} ETH
								</div>
							</div>
						))}
					</div>
				) : null}
				<Button
					extraClassName="absolute -bottom-4 !bg-pinky !rounded-[50%] px-8 pt-3 pb-1 left-1/2 -translate-x-1/2 leading-none"
					onClick={() => {
						setTogglePrizeStructure(!togglePrizeStructure);
					}}
				>
					{togglePrizeStructure ? 'Hide' : 'View'} Prize
					<br /> Structure
				</Button>
			</div>
		</div>
	);
};

export default YourTicketSection;
