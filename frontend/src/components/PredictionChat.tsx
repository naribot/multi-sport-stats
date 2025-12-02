import { useState } from "react";
import "./PredictionChat.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function PredictionChat({
  sport,
  player,
}: {
  sport: string;
  player: any | null;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !player) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          playerName: player.name,
          stats: player,
          prompt: input,
        }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        role: "assistant",
        content: data.prediction || "No response",

      };

      setMessages((m) => [...m, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Error contacting prediction API." },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  //  RESIZING LOGIC 
const [panelWidth, setPanelWidth] = useState(350); 

const startResize = (e: React.MouseEvent) => {
  e.preventDefault();
  document.addEventListener("mousemove", doResize);
  document.addEventListener("mouseup", stopResize);
};

const doResize = (e: MouseEvent) => {
  const newWidth = window.innerWidth - e.clientX;
  if (newWidth > 250 && newWidth < 700) {
    setPanelWidth(newWidth);
  }
};

const stopResize = () => {
  document.removeEventListener("mousemove", doResize);
  document.removeEventListener("mouseup", stopResize);
};


  return (
    <>
      <button className="chat-float-btn" onClick={() => setOpen(true)}>
        🔮
      </button>
      <div   style={{ width: panelWidth }} className={`chat-panel ${open ? "open" : ""}`}>
        <div className="chat-header">
          <h3 style={{marginLeft:"85px", color:"darkblue"}}>Prediction AI</h3>
          <button className="close-btn" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="chat-panel-resize-handle" onMouseDown={startResize}></div>
        <div className="chat-body">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat-msg ${m.role === "user" ? "user" : "assistant"}`}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="chat-msg assistant">⏳ Thinking...</div>
          )}
        </div>

        <div className="chat-input-row">
          <input
            placeholder="Ask a prediction..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
