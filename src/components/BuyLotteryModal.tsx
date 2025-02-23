'use client';

import Image from 'next/image';
import { useState } from 'react';
import addIcon from '../assets/images/add.svg';
import removeIcon from '../assets/images/remove.svg';
import closeIcon from '../assets/images/close.svg';
import Button from './Button';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import LotteryNftSvg from '../assets/images/lottery-nft.svg';

type BuyModalProps = {
	ticketPrice: number;
	isOpen: boolean;
	close: () => void;
	buyTicket: (quantity: number) => void;
	maxTickets: number;
	isLoading: boolean;
};

const BuyLotteryModal = ({
	ticketPrice,
	isOpen,
	close,
	buyTicket,
	isLoading,
	maxTickets,
}: BuyModalProps) => {
	const [quantity, setQuantity] = useState(1);

	const { address } = useAccount();
	const balance = useBalance({
		address,
	}).data;

	if (!isOpen) {
		return null;
	}
	const isDisabled =
		+formatEther(balance?.value || (0 as unknown as bigint)) <
		ticketPrice * quantity;

	return (
		<div>
			<div
				className="overflow-y-auto overflow-x-hidden fixed inset-0 z-40 w-full h-full max-h-full bg-primary/80"
				onClick={close}
			/>
			<div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-tertiary border border-black border-b-4 p-4 pb-16 rounded-lg">
				<button className="absolute top-4 right-4" onClick={close}>
					<Image
						src={closeIcon}
						alt="Close"
						width={20}
						height={20}
						onClick={close}
					/>
				</button>
				<div className="text-blueGreen font-outline text-center text-2xl leading-none mt-4">
					Buy Your
					<br /> Tickets
				</div>
				<div className="mt-4 flex justify-center">
					<div
						className="w-48 h-48 rounded-lg"
						style={{
							backgroundImage: `url(${LotteryNftSvg.src})`,
							backgroundSize: 'cover',
						}}
					/>
				</div>
				<div className="mt-4 flex justify-center">
					<div className="bg-[#000122] rounded-lg border border-black border-b-4 flex items-center gap-4">
						<button
							onClick={() => {
								if (quantity > 1) {
									setQuantity(quantity - 1);
								}
							}}
							className="p-4"
						>
							<Image
								src={removeIcon}
								width={20}
								height={20}
								alt="-"
							/>
						</button>
						<div className="text-white text-4xl leading-none pt-2 max-w-8 text-center">
							{quantity}
						</div>
						<button
							onClick={() => {
								if (quantity < 99 && quantity < maxTickets) {
									setQuantity(quantity + 1);
								}
							}}
							className="p-4"
						>
							<Image
								src={addIcon}
								width={20}
								height={20}
								alt="-"
							/>
						</button>
					</div>
				</div>
				<div className="mt-8 text-white font-outline text-4xl text-center">
					{(ticketPrice * quantity).toFixed(6)} ETH
				</div>
				<div className="flex justify-center">
					<Button
						extraClassName="absolute -bottom-4 text-2xl w-3/4 pt-4 pb-2"
						onClick={() => {
							if (!isDisabled) {
								buyTicket(quantity);
							}
						}}
						isDisabled={isDisabled || isLoading}
					>
						{isDisabled ? (
							<span className="absolute -top-4 bg-red-500 text-sm px-2 pt-1 rounded -right-4 text-white font-outline border border-b-4 border-black">
								Low Balance
							</span>
						) : null}
						{isLoading ? 'Buying...' : 'Buy Now'}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BuyLotteryModal;
