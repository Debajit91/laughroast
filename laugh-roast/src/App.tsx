import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import axios from "axios";
import "./style.css";

// ফানি ওয়েটিং মেসেজগুলোর লিস্ট (ইচ্ছেমতো আরও যোগ করতে পারেন)
const waitingTexts = [
  "🤖 আপনার বন্ধুর অতীত ইতিহাস খোঁজা হচ্ছে...",
  "🕵️ গোপন সূত্র থেকে বাঁশ গোছানো হচ্ছে...",
  "⚙️ মিম জেনারেটরের ইঞ্জিন গরম হচ্ছে...",
  "🔥 রোস্টিংয়ের কড়াইয়ে তেল দেওয়া হচ্ছে...",
  "💀 ফাইনাল ট্রোলের স্ক্রিপ্ট রেডি হচ্ছে...",
];


export default function App() {
  const [name, setName] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [roasts, setRoasts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState("");
  const [thinkingText, setThinkingText] = useState("");
  const [theme, setTheme] = useState("fire");
  const [cardImage, setCardImage] = useState("");

  const generateRoast = async () => {
  if (!name.trim()) return alert("Please enter a name!");

  setLoading(true);
  setRoasts([]);
  setDisplayText("");
  setCardImage("");

  // ১. প্রথম মেসেজটি সাথে সাথে সেট করুন
  let textIndex = 0;
  setThinkingText(waitingTexts[textIndex]);

  // ২. প্রতি ২ সেকেন্ড (২০০০ মিলিসেকেন্ড) পর পর মেসেজ চেঞ্জ করার টাইমার
  const intervalId = setInterval(() => {
    textIndex = (textIndex + 1) % waitingTexts.length;
    setThinkingText(waitingTexts[textIndex]);
  }, 2000);

  try {
    const res = await axios.post(
      "https://laugh-roast-backend.vercel.app/api/roast",
      { name }
    );

    if (res.data?.roast) {
      setRoasts(res.data.roast);
      setDisplayText(res.data.roast.join("\n\n"));
    }
    if (res.data?.image) {
      setCardImage(res.data.image);
    }
  } catch (err) {
    console.log(err);
    setDisplayText("Server shock খেয়েছে! আবার ট্রাই করুন। 😭");
  } finally {
    // ৩. রিকোয়েস্ট শেষ হলে টাইমারটি অবশ্যই ক্লিয়ার (বন্ধ) করে দিতে হবে
    clearInterval(intervalId);
    setLoading(false);
    setThinkingText("");
  }
};

  const shareToWhatsApp = () => {
    if (roasts.length === 0) return;

     const message =
    `😂 LaughRoast Result 😂\n\n` +
    roasts.join("\n\n") +
    `\n\n🔥 Roast yourself here: https://laugh-roast.vercel.app`;

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};

  const downloadRoastCard = async () => {
    if (!cardRef.current) return;

    try {
      // html-to-image যেন ইমেজ প্রসেস করতে একটু সময় পায়, তাই cacheBust ব্যবহার করা ভালো
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        style: { transform: 'scale(1)' } // অনেক সময় জুম ইন থাকলে ইমেজ কেটে যায়, এটা ফিক্স করবে
      });

      const link = document.createElement("a");
      link.download = `${name || "laugh"}-roast-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Card generation failed:", err);
      alert("Failed to generate image card. Try copying text!");
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

        {/* কার্ডের কন্টেন্ট (টেক্সট ও ছবি) থাকলে তবেই কার্ডটি সুন্দর দেখাবে */}
        {(displayText || cardImage) && (
          <div ref={cardRef} className={`roast-card ${theme}`}>
            <div className="roast-title">🔥 LaughRoast</div>
            <div className="roast-name">{name}</div>

            {/* inline style দিয়ে whiteSpace হ্যান্ডেল করা হলো যেন \n কাজ করে */}
            <div className="roast-text" style={{ whiteSpace: "pre-line" }}>
              {displayText}
            </div>

            {cardImage && cardImage.length > 0 &&(
              <img
                src={cardImage}
                alt="Roast Meme"
                className="card-img"
                crossOrigin="anonymous" // ইমেজ রেন্ডারিং বাগ ফিক্স করার জন্য
                style={{ aspectRatio: "4 / 3", width: "100%", borderRadius: "8px", marginTop: "15px" }}
              />
            )}

            <div className="roast-footer">laugh-roast.vercel.app</div>
          </div>
        )}

        {roasts.length > 0 && (
          <div className="action-buttons" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <button className="share-btn" onClick={shareToWhatsApp}>
              📱 Share to WhatsApp
            </button>

            <button
              className="share-btn"
              onClick={() => {
                navigator.clipboard.writeText(roasts.join("\n"));
                alert("Roast text copied! 📋");
              }}
            >
              📋 Copy Roast
            </button>

            <button className="share-btn" onClick={downloadRoastCard}>
              🖼️ Download Card
            </button>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>Developed by <strong>Debajit Roy</strong></p>
        <p>
          <a href="mailto:debajitroy544@gmail.com">📧 debajitroy544@gmail.com</a> | 📱 +8801783388518
        </p>
      </footer>
    </div>
  );
}