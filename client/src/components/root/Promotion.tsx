import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Promotion = () => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = Math.max(
        Number(targetDate) - Number(currentTime),
        0
      );

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });

      if (timeDifference === 0) {
        clearInterval(timerInterval);
        // You can add code here to handle what happens when the target date is reached.
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval); // Cleanup the interval when the component unmounts.
    };
  }, []);
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div className="flex flex-col justify-center space-y-10 font-jost">
        <h3 className="font-semibold text-4xl text-dark-1 dark:text-white/90">
          Deals of the Month
        </h3>
        <p className="leading-10 text-lg font-normal">
          Get ready for a shopping experience like never before with our Deals
          of the Month! Every purchase comes with exclusive perks and offers,
          making this month a celebration of savvy choices and amazing deals.
          Don't miss out! 🎁🛒
        </p>

        <ul className="grid grid-cols-4 gap-5 max-w-lg">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>

        <Link
          to="/shop"
          className={cn(
            buttonVariants,
            "text-lg bg-dark-1 dark:bg-dark-4 rounded-md text-white py-4 px-8 max-w-xs flex justify-center items-center"
          )}
        >
          Continue Shopping
          <ArrowRight className="ml-3 w-5 h-5" />
        </Link>
      </div>

      <div
        className="min-h-500 bg-cover bg-center bg-no-repeat rounded-2xl"
        style={{
          backgroundImage: `url(/images/image-4.svg`,
          //   backgroundSize: "cover",
          //   backgroundPosition: "revert",
          //   backgroundRepeat: "no-repeat",
          height: "500px",
        }}
      ></div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="border border-gray-200 p-4 rounded-xl min-w-[100px] w-full text-center">
    <h4 className="font-extrabold text-2xl">{value}</h4>
    <p>{label}</p>
  </li>
);

export default Promotion;
