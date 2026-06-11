import { useState } from "react";
import "./style.css";

export default function App() {
  const [name, setName] = useState<string>("");
  const [roast, setRoast] = useState<string>("");

  const generateRoast = () => {
    if (!name) return;

    setRoast(`${name} is so funny, even WiFi avoids connecting to him 😂`);
  };

  return (
    <div className="container">
      <div className="title">LaughRoast 😂</div>
      <div className="subtitle">Turn Friends into Fun</div>

      <div className="box">
        <input
          placeholder="Enter friend's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={generateRoast}>Roast Him 🔥</button>

        {roast && <div className="card">{roast}</div>}
      </div>
    </div>
  );
}