import React, { useRef, useState, useEffect } from "react";

const RegisterFace = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState("");

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureAndRegister = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataURL, name }),
    });

    const result = await res.json();
    alert(result.message || "Registered");
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div>
      <h2 className="text-xl mb-2">Register Face</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 border px-2 py-1"
      />
      <br />
      <video ref={videoRef} autoPlay width="640" height="480" className="rounded border" />
      <canvas ref={canvasRef} width="640" height="480" hidden />
      <div className="mt-2 flex gap-2">
        <button onClick={startCamera} className="bg-green-500 text-white px-4 py-2 rounded">
          Start
        </button>
        <button onClick={captureAndRegister} className="bg-purple-500 text-white px-4 py-2 rounded">
          Capture
        </button>
      </div>
    </div>
  );
};

export default RegisterFace;
