import Image from "next/image";
import Link from "next/link";
import LogoSvg from "../../assets/images/logo.svg";
import RatTimerBg from "../../assets/images/timer-bg.png";
import TelegramSvg from "../../assets/images/telegram.svg";
import TwitterSvg from "../../assets/images/twitter.svg";
import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import Button from "@/components/Button";
import PreviousWinsBar from "./PreviousWinsBar";

const stableOptions = [
  {
    id: 1,
    label: "ETH",
  },
  {
    id: 2,
    label: "USD",
  },
];

const HeaderSection = () => {
  const [stable, setStable] = useState(2);

  return (
    <>
      <header className="flex justify-between items-center container mx-auto my-8 z-10 bg-primary">
        <div className="flex gap-8 items-center">
          <Link href="/">
            <Image src={LogoSvg} alt="Money.Games" width={80} />
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {/* <div
            className="border-2 border-black rounded-lg -rotate-3 bg-pinky pt-2 px-4 pb-1 flex gap-2 "
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
            }}
          >
            {stableOptions.map((stableOption) => (
              <button
                key={stableOption.id}
                onClick={() => setStable(stableOption.id)}
                className={
                  stable == stableOption.id
                    ? "uppercase p-2 pb-0 border-2 border-black rounded-lg -rotate-2 bg-secondary hover:rotate-0"
                    : ""
                }
              >
                {stableOption.label}
              </button>
            ))}
          </div> */}

          {/* <button
            className="uppercases border-2 border-black rounded-lg -rotate-3 p-4 pb-2 px-6 text-white text-xl bg-tertiary"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              marginTop: "-10px",
            }}
          >
            connect wallet
          </button> */}
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
                <button
                  className="uppercases border-2 border-black rounded-lg -rotate-3 p-4 pb-2 px-6 text-white text-xl bg-tertiary"
                  style={{
                    boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
                    marginTop: "-10px",
                  }}
                  onClick={show}
                >
                  {isConnected ? truncatedAddress : "Connect Wallet"}
                </button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </header>
    </>
  );
};

export default HeaderSection;
