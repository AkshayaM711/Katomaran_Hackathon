import React, { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:4001");
    ws.current.onmessage = (e) => setMsgs((m) => [...m, JSON.parse(e.data)]);
    return () => ws.current.close();
  }, []);

  const send = () => {
    if (!input.trim()) return;
    ws.current.send(input);
    setMsgs((m) => [...m, { role: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="h-[28rem] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.role === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-white border"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded px-3 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="bg-purple-600 text-white px-4 rounded" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
