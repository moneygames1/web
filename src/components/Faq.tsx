"use client";
import { useState } from "react";

const lotteryFaqData = [
  {
    q: "What is Gen Wealth Lottery?",
    a: "Gen Wealth Lottery is your weekly shot at turning a bit of ETH into a big win! Buy a ticket, wait for the draw, and see if you’ve hit the jackpot. Each ticket is a cool NFT that you can trade or show off",
  },
  {
    q: "How do I buy a ticket?",
    a: "First things first - make sure you have some ETH on the base chain. Use your ETH to buy a ticket, which is a unique NFT and you're all set.",
  },
  {
    q: "Can I trade my ticket?",
    a: "Absolutely! Each ticket is a rad NFT, which means you can trade it on any marketplace. Keep it, sell it, show it off—your call",
  },
  {
    q: "When are the draws?",
    a: "We hold the lottery every single week. Mark your calendar, set an alarm, spread the word around and get ready for some excitement!",
  },
  {
    q: "How are the winners chosen?",
    a: "We use decentralized oracles from API3 to ensure pure, uncut randomness straight from the blockchain gods. No rigging here - just fair chances for everyone.",
  },
  {
    q: "How do I check the results & claim my rewards?",
    a: "When the countdown hits zero, the results are in! Head over to the site to see whether you've struck gold. If you’re a winner, you can claim your rewards directly on the site. It's quick and easy!",
  },
];
const ratRoulleteFaqData = [
  {
    q: "How does the live-streamed Hamster Roulette actually work?",
    a: "It's the best of both worlds! Real-life action plus digital fun! Here's the scoop: A countdown timer on our website signals the start of each round. When the timer hits zero, you'll see our real table start to rotate via live stream. A glass box is lifted, releasing our star hamster onto the spinning stage. Watch in real-time as our little hero scurries into one of the houses.",
  },
  {
    q: "On which blockchain is the game played?",
    a: "We’re rolling on the Binance Smart Chain (BSC)! Fast, secure, and cost-effective—just like our hamster's racing skills. This means smooth transactions, quick settlements, and a seamless gaming experience.",
  },
  {
    q: "How is the winner announced?",
    a: "Once our star hamster has made its grand entrance into a house, we will announce the winning house number on the website. It'll pop up on your screen faster than you can say 'cheese!' The website will automatically highlight the winning bets, so you'll know if it's time to celebrate or to try your luck in the next round.",
  },
  {
    q: "What happens if the hamster enters multiple houses?",
    a: "Our star hamster can be quite the explorer! If it decides to do a house tour and enters multiple homes, don't worry - we've got a rule for that! The first house it fully enters is declared the winner. Think of it as a 'first come, first served' policy in the hamster real estate market.",
  },
  {
    q: "Does the hamster have to fully enter a house to win?",
    a: "Absolutely! Our hamster can't just stick its nose in and call it a day. For a house to be declared the winner, our little pal needs to fully commit. All four of it's paws must be inside the house. We don't count partial entries - this isn't a game of rodent limbo!",
  },
  {
    q: "What if the hamster gets stage fright and refuses to move?",
    a: "If our furry little star decides to embrace its inner statue, don't worry! We'll simply try again. We will reset the setup, and we'll give our hamster another chance to shine. If it still isn't in the mood for a stroll, we might bring in an understudy. The show must go on, even if we have to call in the B-team of our rodent cast!",
  },
  {
    q: "How quickly is the winner determined?",
    a: "We'll declare the winning house as soon as the hamster fully enters. Thanks to our multiple camera angles, you'll be able to see the action clearly on the live stream. The whole process usually takes just a few seconds after the hamster starts moving.",
  },
  {
    q: "What if I think I saw the hamster enter a different house than what was announced?",
    a: "While our hamster's decision-making skills are usually crystal clear, we understand that sometimes things can get a bit heated in the world of rodent racing. However, we also record every game and the footage can be reviewed if needed. Multiple camera angles help ensure accuracy. But if you think you've spotted a rare rat teleportation event, you can raise it in the chat. We review all games to maintain fairness. We're committed to fairness, even if our lil star sometimes has a flair for the dramatic!",
  },
  {
    q: "Is there any lag between the actual game and what I see on my screen?",
    a: "We use high-speed streaming technology to keep lag very minimal. It's almost as if you're there in person, just without the risk of our rat stealing your snacks.",
  },
  {
    q: "What happens if the stream cuts out during a game?",
    a: "Don't worry, our camera crew isn't operating on hamster wheel power. But if we do have technical difficulties, we'll pause the game and resume once we're back online. No bets are lost in the meantime.",
  },
  {
    q: "How often do you run games?",
    a: "We run rounds regularly. Check the schedule on our website - we've got more regular showtimes than your favorite soap opera, and arguably more drama!",
  },
];

export const FAQ = ({ game }: { game: "lottery" | "rat-roullete" }) => {
  const [isOpenIndex, setIsOpenIndex] = useState(0);

  let faqData = lotteryFaqData;
  if (game === "rat-roullete") {
    faqData = ratRoulleteFaqData;
  }

  return (
    <section className="container mx-auto mt-48 mb-40">
      <div className="lg:w-2/3 mx-auto ">
        <div className="mx-8">
          <div className="text-tertiary text-4xl font-outline">FAQ</div>
          <div className="my-4">
            {faqData?.length
              ? faqData.map(({ q, a }, index) => {
                  return (
                    <div
                      className={`py-4 lg:py-6 cursor-pointer border-solid border-x-0 border-black border-b-[0.5px] ${
                        index !== 0 ? "border-t-[0.5px]" : "border-t-0"
                      }`}
                      onClick={() =>
                        setIsOpenIndex(isOpenIndex === index ? -1 : index)
                      }
                      key={q}
                    >
                      <div
                        className="text-xl lg:text-3xl sm:text-[2vw] flex items-center text-white font-outline"
                        style={{
                          boxSizing: "border-box",
                        }}
                      >
                        {q}
                        {/* <span className="ml-4">
												<svg
													style={{
														width: 20,
														transform: `rotate(${
															isOpenIndex !==
															index
																? 135
																: 0
														}deg)`,
														transition:
															'transform 0.4s ease-in-out',
													}}
													width="34"
													height="35"
													viewBox="0 0 34 35"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M33.9513 34.3749L16.9808 26.5715L0.0101917 34.3749L7.81357 17.4043L0.0101903 0.433732L16.9808 8.23711L33.9513 0.433733L26.1479 17.4043L33.9513 34.3749Z"
														fill={
															isOpenIndex !==
															index
																? '#C5F500'
																: '#6D48FF'
														}
													/>
												</svg>
											</span> */}
                      </div>
                      {/* {isOpenIndex === index ? ( */}
                      <div
                        style={{
                          boxSizing: "border-box",
                          transition: "max-height 0.4s ease-in-out",
                        }}
                        className={`text-sm lg:text-lg sm:text-[1.4vw] leading-normal sm:w-4/5 max-h-0 overflow-hidden ${
                          isOpenIndex === index ? "max-h-64" : ""
                        }`}
                      >
                        <div className="pt-2 pb-4">{a}</div>
                      </div>
                      {/* ) : null} */}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </section>
  );
};
