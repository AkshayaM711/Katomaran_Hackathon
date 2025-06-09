
# Katomaran Face Recognition Platform

A real-time browser-based face recognition platform built with React.js (frontend), Node.js (API/WebSocket), and Python (face recognition logic) for the Katomaran AI Hackathon.

---

## 📁 Project Structure

```

katomaran-face-platform/
├── AI models/
│   ├── recognize.py           # Face recognition logic
│   ├── register.py            # Face registration logic
│   ├── faces.db               # SQLite DB or similar
│   └── logs.csv               # Log file (optional)
├── backend/
│   ├── app.js                 # Node.js server
│   ├── registered\_faces/      # Stores registered face images
│   └── known\_faces/           # Used by Python script (optional)
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Root app component
│   │   ├── components/
│   │   │   ├── LiveCam.jsx    # Live recognition component
│   │   │   └── RegisterFace.jsx # Face registration component
└── rag\_service/               # Optional: RAG chatbot module

````


## 🧠 Features

* ✅ Register faces via webcam
* ✅ Store face images with names
* ✅ Recognize faces in real-time video
* ✅ Display bounding box with name
* 🧪 Extendable with RAG chatbot (in `rag_service/`)

---

## 🛠️ Tech Stack

* **Frontend**: React.js + Tailwind CSS
* **Backend**: Node.js (Express)
* **Face Recognition**: Python (`face_recognition` library)
* **Communication**: HTTP + JSON (no WebSockets yet)

---

## 📦 Dependencies

**Python**:

```bash
pip install face_recognition opencv-python
```

**Node.js**:

```bash
npm install express cors body-parser
```

---

## 📷 Sample Workflow

1. Go to **Register Face**
2. Capture image and enter name
3. Face image is saved in `backend/registered_faces/`
4. Go to **Live Recognition**
5. Start camera — bounding boxes and names will appear on matches

---

## 🧪 Optional Enhancements

* Add WebSocket support for smoother live updates
* Use SQLite/Postgres to store face metadata
* Add "Delete Face" or "Update Face" features
* Integrate with RAG chatbot (in `rag_service/`)

---

## 📜 License

MIT — free to use and modify for research, hackathons, or personal projects.

---

## ✨ Contributors

* Akshaya \  🚀

## Demo Video Link
https://drive.google.com/file/d/1U0gMzJ45ibeUZL_nmYd9xPljODO-7LOJ/view?usp=sharing

