import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import axios from "axios";
import "./style.css";
import { memeImages } from "./data/memeImages";

export default function App() {
  const [name, setName] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [roasts, setRoasts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState("");
  const [thinkingText, setThinkingText] = useState("");
  const [theme, setTheme] = useState("fire");
  const [cardImage, setCardImage] = useState<string>("");

  const getRandomImage = () => {
    return memeImages[Math.floor(Math.random() * memeImages.length)];
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));


  const generateRoast = async () => {
    setLoading(true);

    const thinkingInterval = startThinkingAnimation();

    try {
      const res = await axios.post(
        "https://laugh-roast-backend.vercel.app/api/roast",
        { name }
      );

      const roastText = res.data.roast.join("\n");
      // setDisplayText(roastText);

      setRoasts(res.data.roast);

      

      // ⛔ delay before typing starts
      await sleep(1500);

      clearInterval(thinkingInterval);
      setThinkingText("💀 Finalizing roast...");
      setCardImage(getRandomImage());
      await sleep(800);

      // ✨ now start typing AFTER thinking ends
      typeRoast(roastText);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    if (roasts.length === 0) return;

    const message =
      `😂 LaughRoast Result 😂\n\n` +
      roasts.join("\n\n") +
      `\n\nTry LaughRoast yourself! 🔥`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  const typeRoast = (text: string) => {
    let index = 0;

    setDisplayText("");

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));

      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 30);
  };

  const startThinkingAnimation = () => {
    const texts = [
      "🤖 AI is thinking...",
      "🤖 Scanning target...",
      "🧠 Analyzing weaknesses...",
      "🧠 Finding best roast...",
      "🔥 Loading emotional damage...",
      "💀 Roast locked and loaded...",
      "😂 Launching attack..."
    ];

    setThinkingText(texts[0]);

    let index = 0;

    const interval = setInterval(() => {
      setThinkingText(texts[index]);

      index = (index + 1) % texts.length;
    }, 1000);

    return interval;
  };

  const downloadRoastCard = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current);

      const link = document.createElement("a");

      link.download = "laugh-roast-card.png";
      link.href = dataUrl;

      link.click();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app">
      <div className="card-box">
        <h1>😂 LaughRoast</h1>
        <p>Turn your friends into memes</p>

        <div className="input-box">
          <input
            placeholder="Enter friend's name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button onClick={generateRoast} disabled={loading}>
            {loading ? "Roasting 🔥..." : "Roast Him 😂"}
          </button>

        </div>

        <div className="theme-switch">
          <button onClick={() => setTheme("dark")}>🌑 Dark</button>
          <button onClick={() => setTheme("fire")}>🔥 Fire</button>
          <button onClick={() => setTheme("neon")}>⚡ Neon</button>
        </div>

        {loading && (
          <div className="thinking-box">
            {thinkingText}
          </div>
        )}

        <div ref={cardRef} className={`roast-card ${theme}`}>

          <div className="roast-title">
            🔥 LaughRoast
          </div>

          <div className="roast-name">
            {name}
          </div>

          <div className="roast-text">
            {displayText}
          </div>

          {cardImage && (
            <img src={cardImage} className="card-img" />
          )}

          <div className="roast-footer">
            laughroast.vercel.app
          </div>

        </div>

        {roasts.length > 0 && (
          <button className="share-btn" onClick={shareToWhatsApp}>
            📱 Share to WhatsApp
          </button>

        )}
        {roasts.length > 0 && (
          <button
            className="share-btn"
            onClick={() => navigator.clipboard.writeText(roasts.join("\n"))}
          >
            📋 Copy Roast
          </button>
        )}

        {roasts.length > 0 && (
          <button
            className="share-btn"
            onClick={downloadRoastCard}
          >
            🖼️ Share Card
          </button>
        )}


      </div>


    </div >

  );
}