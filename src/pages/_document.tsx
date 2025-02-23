import { Metadata } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';

export const metadata: Metadata = {
	title: 'Money.Games',
	description: "CRYPTO'S MOST EGALITARIAN REWARDING BONANZA & FESTIVAL",
};

export default function Document() {
	return (
		<Html>
			<Head />
			<body className="overflow-x-hidden">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
