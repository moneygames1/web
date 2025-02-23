import Image from "next/image";
import MainHamsterLogo from "../../assets/images/main-hamster-logo.svg";

const HeroSection = () => {
  return (
    <>
      <section className="flex flex-col justify-center items-center gap-6 ">
        <Image src={MainHamsterLogo} alt="-" />
        <div className="uppercase text-3xl text-white font-outline-1 ">
          <div>predict the Hamster&apos;s House Number &</div>
          <div className="text-center">Win Prizes!</div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
