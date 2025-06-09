import cv2
import face_recognition
import sqlite3
import os
import csv
import sys
from datetime import datetime
from matplotlib import pyplot as plt

# === Get name from user input ===
name = input("Enter your name: ").strip()
if not name:
    print("Name cannot be empty. Exiting.")
    sys.exit(1)

# === Setup directories ===
os.makedirs("known_faces", exist_ok=True)

# === Setup DB ===
DB_PATH = "faces.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    encoding BLOB NOT NULL,
    registered_at TEXT NOT NULL
)
''')
conn.commit()

# === Save to logs.csv ===
def save_log(name, action="Registered"):
    log_file = "logs.csv"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    file_exists = os.path.exists(log_file)
    with open(log_file, mode='a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Name", "Action", "Timestamp"])
        writer.writerow([name, action, timestamp])

# === Start webcam ===
print(f"\nRegistering user: {name}")
video = cv2.VideoCapture(0)

if not video.isOpened():
    print("❌ Could not open webcam.")
    conn.close()
    sys.exit(1)

print("📸 Capturing frame... Please look at the camera.")
ret, frame = video.read()
video.release()

if not ret:
    print("❌ Failed to capture image.")
    conn.close()
    sys.exit(1)

# Convert to RGB for face_recognition and matplotlib
rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

# === Show image using matplotlib ===
plt.imshow(rgb_frame)
plt.title("Captured Image - Close window to continue")
plt.axis("off")
plt.show()

# === Confirm use ===
confirm = input("Use this photo? (y/n): ").strip().lower()
if confirm != 'y':
    print("❌ Cancelled.")
    conn.close()
    sys.exit(1)

# === Face detection ===
face_locations = face_recognition.face_locations(rgb_frame)
face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

if len(face_encodings) != 1:
    print(f"❌ Expected 1 face, but found {len(face_encodings)}. Exiting.")
    conn.close()
    sys.exit(1)

encoding = face_encodings[0]
encoding_blob = encoding.tobytes()
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# === Save to DB ===
cursor.execute("INSERT INTO users (name, encoding, registered_at) VALUES (?, ?, ?)",
               (name, encoding_blob, timestamp))
conn.commit()

# === Save image and logs ===
cv2.imwrite(f"known_faces/{name}.jpg", frame)
save_log(name, "Registered")

print(f"\n✅ Registered {name} at {timestamp}")
print("📝 Log entry added to logs.csv")
conn.close()
