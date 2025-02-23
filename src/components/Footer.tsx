import Image from 'next/image';

import FooterBg from '../assets/images/footer-bg.svg';
import LogoSvg from '../assets/images/logo.svg';
import TelegramInverseSvg from '../assets/images/telegram-inverse.svg';
import TwitterInverseSvg from '../assets/images/twitter-inverse.svg';

const Footer = () => {
	return (
		<footer className="mt-20 lg:mt-4 w-full">
			<Image
				src={FooterBg}
				alt="Footer Background"
				className="w-full absolute -z-10"
			/>
			<div className="mx-auto container">
				<div className="flex justify-between">
					<div className="lg:mt-12">
						<Image
							src={LogoSvg}
							alt="Money.Games"
							className="pl-8 pt-6 w-28 lg:-w[160px]"
						/>
					</div>

					<div className="flex gap-4 mr-4 mt-10 lg:mr-40 lg:mt-40">
						<a
							href="https://t.me/themoney_games"
							rel="noopener noreferrer"
							target="_blank"
						>
							<Image
								src={TelegramInverseSvg}
								alt="Telegram"
								width={40}
							/>
						</a>
						<a
							href="https://x.com/the_money_games"
							rel="noopener noreferrer"
							target="_blank"
						>
							<Image
								src={TwitterInverseSvg}
								alt="Twitter"
								width={40}
							/>
						</a>
					</div>
				</div>
				<p className="mt-12 mb-12 text-primary uppercase hidden lg:block">
					© 2024 money.games - All Rights Reserved
				</p>
			</div>
		</footer>
	);
};

export default Footer;
