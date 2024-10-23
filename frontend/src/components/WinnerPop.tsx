import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface WinnerPopupProps {
  player: string;
}

const WinnerPopup: React.FC<WinnerPopupProps> = ({ player }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Track window size for confetti responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Celebration Confetti */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        style={{ pointerEvents: "none" }} // Disable pointer events for confetti
      />
      <div
        className="relative p-8 rounded-lg shadow-lg max-w-xs w-full text-center z-50"
        style={{
          backgroundImage: "url('/back.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {" "}
        {/* Set a high z-index */}
        {/* Popup animations */}
        <h2 className="text-3xl font-color text-gray-800">
          🎉 {player} 🎉
        </h2>
        <img
          src="/icon.png" // Update this with your own trophy image
          alt="Winner Trophy"
          className="w-32 h-32 mx-auto my-6 animate-spin-slow"
        />
        <button
          onClick={()=>{
            window.location.href="https://nixarcade.fun"
          }}
          className="mt-4 px-6 py-2 bg-black border hover:bg-gray-700 text-white rounded-lg hover:opacity-50 focus:outline-none transition duration-300 ease-in-out z-50" // Set a high z-index for button
        >
          Go back to Nixarcade
        </button>
      </div>
      <div className="fixed inset-0 bg-black opacity-50 pointer-events-auto z-40"></div>{" "}
      {/* Overlay */}
    </div>
  );
};

export default WinnerPopup;
