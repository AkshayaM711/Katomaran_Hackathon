import React, { useRef, useEffect } from "react";

const LiveCam = () => {
  const vid = useRef(null);
  const cvs = useRef(null);
  let    loop = null;

  const sendFrame = async () => {
    const ctx = cvs.current.getContext("2d");
    ctx.drawImage(vid.current, 0, 0, cvs.current.width, cvs.current.height);
    const img = cvs.current.toDataURL("image/png");

    try {
      const res  = await fetch("http://localhost:5000/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: img }),
      });
      const faces = await res.json();
      ctx.clearRect(0, 0, cvs.current.width, cvs.current.height);
      ctx.drawImage(vid.current, 0, 0, cvs.current.width, cvs.current.height);

      faces.forEach(f => {
        ctx.strokeStyle = "lime"; ctx.lineWidth = 2;
        ctx.strokeRect(f.x, f.y, f.width, f.height);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(f.x, f.y - 18, f.name.length * 10, 18);
        ctx.fillStyle = "#00FF00"; ctx.font = "14px sans-serif";
        ctx.fillText(f.name, f.x + 4, f.y - 4);
      });
    } catch(e) {
      console.error("recognize fail", e);
    }
  };

  const startCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video:true });
    vid.current.srcObject = stream;
    vid.current.onloadedmetadata = () => {
      cvs.current.width  = vid.current.videoWidth;
      cvs.current.height = vid.current.videoHeight;
      loop = setInterval(sendFrame, 800);  // every 0.8 s
    };
  };

  useEffect(() => () => clearInterval(loop), []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Live Recognition</h2>
      <div className="relative inline-block">
        <video ref={vid} autoPlay muted className="rounded border" />
        <canvas ref={cvs} className="absolute top-0 left-0" />
      </div>
      <button onClick={startCam} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Start Camera
      </button>
    </div>
  );
};

export default LiveCam;
