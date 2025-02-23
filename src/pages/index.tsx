"use client";

import Image from "next/image";

import LogoSvg from "../assets/images/logo.svg";
import TelegramSvg from "../assets/images/telegram.svg";
import TwitterSvg from "../assets/images/twitter.svg";

import FlashSvg from "../assets/images/flash.svg";
import EyeSvg from "../assets/images/eye.svg";
import PokerCardPng from "../assets/images/poker-card.png";
import SpinWheelPng from "../assets/images/spin-wheel.png";
import Vector1ImagePng from "../assets/images/vector1.svg";
import Vector2ImagePng from "../assets/images/vector2.svg";
import Rectangle1ImagePng from "../assets/images/rectangle.svg";

import GoatImage from "../assets/images/games/goat.png";
import RatImage from "../assets/images/games/rat.png";
import LotteryImage from "../assets/images/games/lottery.png";

import { Climate_Crisis } from "next/font/google";
import { useEffect, useRef, useState } from "react";
// import { useMotionValueEvent, useScroll, motion } from 'framer-motion';
import Button from "../components/Button";
import { ConnectKitButton } from "connectkit";
import { Luckiest_Guy } from "next/font/google";
import Footer from "@/components/Footer";
import Link from "next/link";
import RatRoullete from "./hamstu-roullete";

const luckiestGuyFont = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
});

const climateCrisis = Climate_Crisis({
  subsets: ["latin"],
});

export default function Home() {
  return <RatRoullete />;
  // const tokenomicsRef = useRef<HTMLElement>(null);

  // const scrollToTokenomics = () => {
  // 	if (tokenomicsRef?.current) {
  // 		tokenomicsRef?.current?.scrollIntoView({
  // 			behavior: 'smooth',
  // 			block: 'start',
  // 		});
  // 	}
  // };
  // const animateText = () => {
  // 	const text = document.querySelectorAll('#header span span');

  // 	text?.forEach(
  // 		(
  // 			node: { classList: { add: (arg0: string) => void } },
  // 			i: number
  // 		) => {
  // 			setTimeout(() => {
  // 				node?.classList?.add('animate-text');
  // 			}, i * 50);
  // 		}
  // 	);
  // 	const joinCommunityBtn = document.querySelectorAll('#join-community');
  // 	setTimeout(() => {
  // 		joinCommunityBtn[0]?.classList?.add('animate-button');
  // 	}, 1200);
  // };

  // // const { scrollY } = useScroll();

  // // // const [showWin, setShowWin] = useState(false);

  // // // useMotionValueEvent(scrollY, 'change', (latest) => {
  // // // 	if (latest > 640) {
  // // // 		setTimeout(() => {
  // // // 			setShowWin(true);
  // // // 		}, 1000);
  // // // 	} else {
  // // // 		setShowWin(false);
  // // // 	}
  // // // });

  // useEffect(() => {
  // 	setTimeout(() => {
  // 		animateText();
  // 	}, 2000);
  // }, []);

  // const [seconds, setSeconds] = useState(0);

  // useEffect(() => {
  // 	if (seconds < 101) {
  // 		setTimeout(
  // 			() => setSeconds(seconds + 1),
  // 			seconds === 100 ? 300 : 10
  // 		);
  // 	}
  // }, [seconds]);

  // if (seconds < 101) {
  // 	return (
  // 		<main
  // 			className={`min-h-screen relative ${luckiestGuyFont.className}`}
  // 		>
  // 			<div className="flex justify-center items-center h-screen text-white text-8xl font-outline-2">
  // 				<div>{seconds}</div>
  // 			</div>
  // 		</main>
  // 	);
  // }

  // return (
  // 	<main className={`min-h-screen relative ${luckiestGuyFont.className}`}>
  // 		<div className="absolute right-0 top-0 -z-10">
  // 			<Image src={Vector1ImagePng} alt="" />
  // 		</div>
  // 		<header className="p-8 flex justify-between items-center container mx-auto z-10">
  // 			<div>
  // 				<Image src={LogoSvg} alt="Money.Games" width={80} />
  // 			</div>
  // 			<div className="flex gap-4">
  // 				<div className="hidden lg:flex gap-4 mr-8 ">
  // 					<a
  // 						href="https://t.me/themoney_games"
  // 						rel="noopener noreferrer"
  // 						target="_blank"
  // 					>
  // 						<Image
  // 							src={TelegramSvg}
  // 							alt="Telegram"
  // 							width={40}
  // 						/>
  // 					</a>
  // 					<a
  // 						href="https://x.com/the_money_games"
  // 						rel="noopener noreferrer"
  // 						target="_blank"
  // 					>
  // 						<Image src={TwitterSvg} alt="Twitter" width={40} />
  // 					</a>
  // 				</div>
  // 				{/* <div>
  // 					<Button
  // 						extraClassName="bg-white text-sm lg:text-base"
  // 						onClick={() => {
  // 							scrollToTokenomics();
  // 						}}
  // 					>
  // 						Tokenomics
  // 					</Button>
  // 				</div> */}
  // 				{/* <div>
  // 					<Button extraClassName="bg-white">Buy $MONEY</Button>
  // 				</div> */}
  // 				<div>
  // 					<ConnectKitButton.Custom>
  // 						{({
  // 							isConnected,
  // 							isConnecting,
  // 							show,
  // 							hide,
  // 							address,
  // 							ensName,
  // 							chain,
  // 							truncatedAddress,
  // 						}) => {
  // 							return (
  // 								<Button
  // 									onClick={show}
  // 									extraClassName="text-sm lg:text-base"
  // 								>
  // 									{isConnected
  // 										? truncatedAddress
  // 										: 'Connect Wallet'}
  // 								</Button>
  // 							);
  // 						}}
  // 					</ConnectKitButton.Custom>
  // 				</div>
  // 			</div>
  // 		</header>
  // 		<section className="flex flex-col items-center justify-center container mx-auto">
  // 			<div className="relative">
  // 				<Image
  // 					src={PokerCardPng}
  // 					width={90}
  // 					alt=""
  // 					className="hidden lg:block absolute bottom-0 -left-24 animate-poker-card"
  // 				/>
  // 				<Image
  // 					src={SpinWheelPng}
  // 					alt=""
  // 					width={108}
  // 					className="hidden lg:block absolute bottom-16 -right-40 animate-spin-wheel"
  // 				/>
  // 				<h1
  // 					className={`${climateCrisis.className} text-[2rem] lg:text-[8rem] leading-[1] lg:leading-[0.8] text-center uppercase`}
  // 					id="header"
  // 				>
  // 					<span>
  // 						<span className="relative inline-block opacity-0">
  // 							Crypto&apos;s
  // 							<Image
  // 								alt=""
  // 								src={FlashSvg}
  // 								className="absolute left-28 w-5 lg:w-[140px]"
  // 							/>{' '}
  // 							most
  // 						</span>
  // 						<br />
  // 						<span className="opacity-0">egalitarian</span>
  // 						<br />
  // 						<span className="opacity-0">rewarding</span>
  // 						<br />
  // 						<span className="opacity-0">bonanza &</span>
  // 						<br />
  // 						<span className="relative opacity-0">
  // 							festival
  // 							<Image
  // 								alt=""
  // 								src={EyeSvg}
  // 								className="hidden lg:block absolute -right-24 bottom-8 w-8 lg:w-[140px]"
  // 							/>
  // 						</span>
  // 					</span>
  // 				</h1>

  // 				<div className="flex justify-center">
  // 					<a
  // 						href="https://t.me/themoney_games"
  // 						rel="noopener noreferrer"
  // 						target="_blank"
  // 					>
  // 						<Button
  // 							id="join-community"
  // 							extraClassName="opacity-0 mt-8 lg:-mt-4 text-xl lg:text-3xl !p-4 !pb-2"
  // 						>
  // 							Join Community
  // 						</Button>
  // 					</a>
  // 				</div>
  // 			</div>
  // 			<div className="mt-16">
  // 				<p className="lg:text-3xl leading-[0.8] text-center">
  // 					Participate in
  // 					<br /> the biggest lottery
  // 					<br /> ever created!
  // 				</p>
  // 			</div>
  // 		</section>

  // 		<section className="container mx-auto mt-20 lg:mt-48 mb-24 text-center lg:w-1/2">
  // 			<h4 className="text-tertiary text-2xl lg:text-6xl font-outline-2 uppercase">
  // 				About
  // 			</h4>
  // 			<p className="text-lg lg:text-2xl pt-4 px-4 lg:pt-8">
  // 				Experience Crypto&apos;s most egalitarian rewarding bonanza
  // 				and festival, featuring blockchain lottery, real goat races,
  // 				and rat roulette for thrilling, transparent entertainment
  // 				and rewards
  // 			</p>
  // 		</section>

  // 		<section
  // 			className="h-screen"
  // 			style={{
  // 				backgroundImage: `url(${Vector2ImagePng.src})`,
  // 				backgroundRepeat: 'no-repeat',
  // 				backgroundSize: '100vw 100%',
  // 				backgroundPosition: 'center',
  // 			}}
  // 		>
  // 			<div className="container mx-auto text-center pt-16 px-20">
  // 				<h4 className="text-primary text-6xl font-outline-2 uppercase">
  // 					$Games
  // 				</h4>
  // 				<div className="flex flex-col lg:flex-row gap-4 justify-center my-8">
  // 					<div className="group relative">
  // 						<Image src={LotteryImage} alt="" />
  // 						{/* <h6 className="absolute -bottom-5 w-full text-center text-4xl text-primary text-outline font-outline-2 uppercase hidden group-hover:block">
  // 							Coming Soon
  // 						</h6> */}
  // 						<Link href="/lottery">
  // 							<Button extraClassName="absolute bg-white -bottom-4 px-6 text-xl !bg-secondary left-[50%] translate-x-[-50%] hidden group-hover:block">
  // 								Play Now
  // 							</Button>
  // 						</Link>
  // 					</div>
  // 					<div className="group relative">
  // 						<Image src={RatImage} alt="" />
  // 						{/* <h6 className="absolute -bottom-5 w-full text-center text-4xl text-primary text-outline font-outline-2 uppercase hidden group-hover:block">
  // 							Coming Soon
  // 						</h6> */}
  // 						<Link href="/hamstu-roullete">
  // 							<Button extraClassName="absolute bg-white -bottom-4 px-6 text-xl !bg-secondary left-[50%] translate-x-[-50%] hidden group-hover:block">
  // 								Play Now
  // 							</Button>
  // 						</Link>
  // 					</div>
  // 					<div className="group relative">
  // 						<Image src={GoatImage} alt="" />
  // 						<h6 className="absolute -bottom-5 w-full text-center text-4xl text-primary text-outline font-outline-2 uppercase hidden group-hover:block">
  // 							Coming Soon
  // 						</h6>
  // 						{/* <Button extraClassName="absolute bg-white -bottom-4 px-6 text-xl !bg-secondary left-[50%] translate-x-[-50%] hidden group-hover:block">
  // 							Play Now
  // 						</Button> */}
  // 					</div>
  // 				</div>
  // 				{/* <div className="mt-24">Testimnoails</div> */}
  // 			</div>
  // 		</section>

  // 		{/* <section
  // 			className="container mx-auto -mt-48 pt-8 mb-24 text-center lg:w-1/2 px-8"
  // 			ref={tokenomicsRef}
  // 		>
  // 			<h4 className="text-tertiary text-2xl lg:text-6xl font-outline-2 uppercase">
  // 				Tokenomics
  // 			</h4>
  // 			<div
  // 				className="lg:mt-8 py-20"
  // 				style={{
  // 					backgroundImage: `url(${Rectangle1ImagePng.src})`,
  // 					backgroundRepeat: 'no-repeat',
  // 					backgroundSize: '100% 100%',
  // 					backgroundPosition: 'center',
  // 				}}
  // 			>
  // 				<ul className="text-lg lg:text-2xl text-white uppercase">
  // 					<li>
  // 						Token Supply:{' '}
  // 						<span className="text-secondary font-outline uppercase">
  // 							1,000,000,000
  // 						</span>
  // 					</li>
  // 					<li>
  // 						<span className="text-secondary font-outline uppercase">
  // 							1%
  // 						</span>{' '}
  // 						Buy/sell fees
  // 					</li>
  // 					<li>
  // 						<span className="text-secondary font-outline uppercase">
  // 							35%
  // 						</span>{' '}
  // 						Burn tokens
  // 					</li>
  // 					<li>
  // 						<span className="text-secondary font-outline uppercase">
  // 							30%
  // 						</span>{' '}
  // 						Airdrop
  // 					</li>
  // 					<li>
  // 						<span className="text-secondary font-outline uppercase">
  // 							15%
  // 						</span>{' '}
  // 						Liquidity pool
  // 					</li>
  // 					<li>
  // 						<span className="text-secondary font-outline uppercase">
  // 							20%
  // 						</span>{' '}
  // 						Team
  // 					</li>
  // 				</ul>
  // 			</div>
  // 		</section> */}

  // 		<Footer />
  // 	</main>
  // );
}
