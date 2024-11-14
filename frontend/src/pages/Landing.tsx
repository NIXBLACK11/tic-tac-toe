import '../App.css';
import { initGame } from '../backendCalls/initGame';
import { useNavigate } from 'react-router-dom';
import { codeState, socketState, playerState, publicKeyState } from '../atoms/atom';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { getJWT, removeJWT } from '../utils/jwt-storage';
import { verifyToken } from '../utils/verify-tokens';


export const Landing = () => {
    const [publicKey, setPublicKey] = useRecoilState(publicKeyState);
    const [code, setCode] = useRecoilState(codeState);
    const [socket, _setSocket] = useRecoilState(socketState);
    const [_player, setPlayer] = useRecoilState(playerState);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isWaitingPopup, setIsWaitingPopup] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    useEffect(() => {
        const verify = async () => {
            try {
                const token = getJWT();
                if (!token) {
                    window.location.href = "https://nixarcade.fun";
                    return;
                }
                const data = await verifyToken(token, "apisecret");
                if (data == null || data.verified == false) {
                    window.location.href = "https://nixarcade.fun";
                } else {
                    setPublicKey(data.publicKey);
                    removeJWT();
                }
            } catch (e) {
                console.error("Error verifying token:", e);
                alert("Token Verification Failed");
                window.location.href = "https://nixarcade.fun";
                console.log(e);
            }
        };
        verify();
    }, []);


    const triggerPopup = (isWaiting: boolean) => {
        setShowPopup(true);
        setIsWaitingPopup(isWaiting);
        if (!isWaiting) {
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        }
    };

    useEffect(() => {
        if (!socket) return;
        const handleMessage = (event: { data: { toString: () => string; }; }) => {
            try {
                const message = JSON.parse(event.data.toString());
                console.log('Message from server:', message);

                if (message.type === "init_game") {
                    setPlayer(message.payload.player);
                    navigate('/game');
                }
                else if (message.type === "game_code_in_use") {
                    setPopupMessage("Game code already in use!!");
                    triggerPopup(false);
                }
                else if (message.type === "waiting_for_players") {
                    setPopupMessage("Waiting for other players to join!!");
                    triggerPopup(true);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        socket.onmessage = handleMessage;
    }, [socket, setPlayer, navigate]);

    return (
        <div className="h-screen flex flex-col">
            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-slate-700 bg-opacity-95 rounded-lg shadow-xl p-6 mx-4 relative">
                        {isWaitingPopup && (
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-2 right-3 text-gray-300 hover:text-white text-xl font-bold"
                            >
                                ×
                            </button>
                        )}
                        <p className="font-custom font-color2 text-xl md:text-3xl text-center">{popupMessage}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center">
                {/* Logo Section - reduced vertical spacing */}
                <div className="text-center w-full max-w-4xl px-4 mb-6">
                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                        <img
                            className="w-full h-auto object-contain"
                            src="tictactoe.png"
                            alt="Tic Tac Toe Logo"
                        />
                    </div>
                    <h1 className="font-custom font-color text-3xl md:text-5xl mt-4">
                        Welcome to Tic Tac Toe
                    </h1>
                </div>

                {/* Game Code Input Section - reduced spacing */}
                <div className="w-full max-w-2xl px-4 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                        <label className="font-custom font-color text-2xl md:text-3xl whitespace-nowrap">
                            Enter the code:
                        </label>
                        <input
                            className="bg-black font-custom font-color text-xl md:text-3xl border-2 rounded px-4 py-2 w-full md:w-auto max-w-[200px]"
                            onChange={handleChange}
                            type="text"
                            placeholder="Game code"
                        />
                    </div>
                </div>

                {/* Enter Game Button */}
                <button
                    type="button"
                    className="font-custom font-color text-2xl md:text-3xl px-8 py-3 rounded-full border 
                             hover:bg-black transition-colors duration-300"
                    onClick={() => {
                        if (!socket) return;
                        initGame(socket, code, publicKey);
                    }}
                >
                    Enter Game
                </button>
            </div>
        </div>
    );
};

export default Landing;
