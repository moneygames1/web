import { useEffect, useState } from "react";

const CountDownSection = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  // Calculate the time left as an object of days, hours, minutes, and seconds
  function calculateTimeLeft(target: Date) {
    const now = new Date().getTime();
    const distance = target.getTime() - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  // Render the countdown timer
  return (
    <section className="text-center uppercase my-8">
      <div className="text-secondary text-5xl font-outline">
        {timeLeft.days > 0 && <span>{timeLeft.days}d : </span>}
        <span>
          {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
        </span>
      </div>
      <div className="font-outline text-white">until the next draw</div>
    </section>
  );
};
export default CountDownSection;
