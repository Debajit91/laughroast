import { useState } from "react";
import axios from "axios";
import "./style.css";

export default function App() {
  const [name, setName] = useState<string>("");
  const [roasts, setRoasts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState("");

  const generateRoast = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/roast", {
        name,
      });

      const roastList = res.data.roast;

      setRoasts(roastList);

      typeRoast(roastList.join("\n\n"));
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

        <div className="roast-card typing-card">
          {displayText}
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
      </div>


    </div>
    
  );
}