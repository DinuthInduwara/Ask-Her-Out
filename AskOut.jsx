import { useState, useEffect } from "react";

export  function AskOut() {
    const [step, setStep] = useState(0);
    const [noText, setNoText] = useState("No");
    const [yesSize, setYesSize] = useState("text-xl");
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Get browser details
        const browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenSize: `${window.screen.width}x${window.screen.height}`,
        };

        // Fetch IP and location info
        fetch("https://ipinfo.io/json?token=0b07b6a04e84df")
            .then((res) => res.json())
            .then((data) => setUserData({ ...browserInfo, ...data }));
    }, []);

    const noMessages = [
        "Are you sure?",
        "Really sure?",
        "Think again...",
        "Last chance!",
        "Don't do this...",
        "Come on, say yes!",
        "You have no choice now!",
    ];

    const handleNoClick = () => {
        if (step < noMessages.length) {
            setNoText(noMessages[step]);
            setYesSize(`text-${(step + 2) * 2}xl`);
            setStep(step + 1);
        } else {
            setYesSize("text-[20vw]");
        }
    };

    const handleYesClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    
                    setUserData({
                        ...userData,
                        position: {
                            coords: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        }
                    });


                },
                () => alert("Failed to get location"),
                { enableHighAccuracy: true }
            );
        }
        alert("I'm so happy you said yes! 😊");
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
            <h1 className="text-3xl mb-6">Will You Go Out With Me?</h1>
            <button
                className={`bg-green-500 text-white px-6 py-3 rounded-md transition-all ${yesSize}`}
                onClick={handleYesClick}
            >
                Yes
            </button>
            <button
                className="bg-red-500 text-white px-6 py-3 rounded-md mt-4"
                onClick={handleNoClick}
            >
                {noText}
            </button>
            {userData && (
                <div className="mt-6 text-sm text-gray-600">
                    <p>Browser: {userData.userAgent}</p>
                    <p>Platform: {userData.platform}</p>
                    <p>Screen: {userData.screenSize}</p>
                    <p>IP: {userData.ip}</p>
                    <p>Location: {userData.city}, {userData.region}, {userData.country}</p>
                    {userData}
                </div>
            )}
        </div>
    );
}
