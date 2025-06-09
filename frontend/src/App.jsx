import React, { useState } from "react";
import LiveCam from "./components/LiveCam";
import RegisterFace from "./components/RegisterFace";
import ChatWidget from "./components/ChatWidget";


const App = () => {
  const [view, setView] = useState("register");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Face Recognition Platform</h1>

      <div className="mb-4">
        <button onClick={() => setView("register")} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
          Register Face
        </button>
        <button onClick={() => setView("recognize")} className="bg-green-500 text-white px-4 py-2 rounded">
          Live Recognition
        </button>
      </div>

      {view === "register" && <RegisterFace />}
      {view === "recognize" && <LiveCam />}
    </div>
  );
};

export default App;
