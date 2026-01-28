/**
 * Sends a message to Telegram for notifications
 * Used to notify when user interacts with the website
 */
export const sendMessageTelegram = (message) => {
    const API_TOKEN = "1988869232:AAEZl3nmyyz-NRRDD9mX3wpnYnM9EUBghjY";
    const CHAT_ID = "1948924702";

    return fetch(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
        }),
    })
        .then((response) => response.json())
        .then((data) => data);
};
