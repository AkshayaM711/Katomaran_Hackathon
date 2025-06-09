# recognize.py  ← placed at project root (one level above backend/)
import sys, json, os, base64, numpy as np, face_recognition
from io import BytesIO
from PIL import Image

DIR = os.path.join("backend", "registered_faces")

def load_known():
    names, encs = [], []
    for f in os.listdir(DIR):
        if f.endswith(".png"):
            img = face_recognition.load_image_file(os.path.join(DIR, f))
            e   = face_recognition.face_encodings(img)
            if e:
                names.append(os.path.splitext(f)[0])
                encs.append(e[0])
    return names, encs

def main():
    names, encs = load_known()
    data   = json.loads(sys.stdin.read())
    img_b64= data["image"].split(",")[1]
    img    = Image.open(BytesIO(base64.b64decode(img_b64)))
    rgb    = np.array(img)

    locs   = face_recognition.face_locations(rgb)
    enc_in = face_recognition.face_encodings(rgb, locs)

    res = []
    for (t,r,b,l), enc in zip(locs, enc_in):
        match = face_recognition.compare_faces(encs, enc, tolerance=0.45)
        name  = names[match.index(True)] if True in match else "Unknown"
        res.append({ "name":name, "x":l, "y":t, "width":r-l, "height":b-t })
    print(json.dumps(res))

if __name__ == "__main__":
    main()
