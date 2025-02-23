'use client';

import { format } from 'date-fns';
import GreenCoinSvg from '@/assets/images/green-coin.svg';
import Image from 'next/image';

type YourTicketSectionProps = {
	currentGameSeasonId: {
		seasonId: number;
		gameId: number;
	};
	endTime: number;
	userBetInfo: {
		betNumber: number;
		betAmount: number;
	}[];
	currency: 'USDC' | 'ETH';
};

const YourBetsSection = ({
	currentGameSeasonId,
	endTime,
	userBetInfo,
	currency,
}: YourTicketSectionProps) => {
	return (
		<section className="container mx-auto">
			<div className="bg-black px-[2px] pb-1 w-4/5 lg:w-1/2 mx-auto rounded-lg">
				<div className="lg:flex justify-between text-white uppercase p-4 pb-2">
					<div className="text-lg">
						Season {currentGameSeasonId.seasonId + 1}
					</div>
					<div className="text-lg">
						{format(new Date((endTime || 0) * 1000), 'PPpp')}
					</div>
				</div>
				<div className="bg-tertiary rounded-b-lg relative">
					<div className="p-4">
						{userBetInfo?.length ? (
							<div>
								<div className="text-blueGreen font-outline text-center text-2xl">
									Your Bets
								</div>
								<div className="grid lg:grid-cols-3 gap-4 p-8">
									{userBetInfo.map((betInfo, index) => {
										return (
											<div
												key={betInfo.betNumber}
												className={`p-4 rounded-lg border-2 border-black border-b-[6px] ${
													betInfo.betNumber % 2 === 0
														? 'bg-lightRed'
														: 'bg-black'
												} ${
													index % 2 === 0
														? 'rotate-2'
														: '-rotate-3'
												}`}
											>
												<div className="h-full ">
													<div className="text-center mt-4 text-white text-6xl font-outline-2">
														{betInfo.betNumber}
													</div>
													<div className="flex justify-center items-center text-white gap-2">
														<Image
															src={GreenCoinSvg}
															alt="Coin"
															width={24}
														/>
														<div className="pt-px text-xl">
															${betInfo.betAmount}{' '}
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						) : (
							<div className="mt-8 mb-16 w-1/2 mx-auto">
								<div className="text-lg text-center">
									You haven&apos;t placed a bet yet.
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default YourBetsSection;
