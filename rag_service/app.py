from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import sqlite3, os

# Load environment variables
load_dotenv()

app = FastAPI()

# Constants
DB_PATH = "../backend/face_recognition/faces.db"
VEC_DIR = "data/faiss_index"
emb = OpenAIEmbeddings()

# Build vector index from DB if data exists
def build_vector_index():
    texts, meta = [], []
    conn = sqlite3.connect(DB_PATH)
    for name, ts in conn.execute("SELECT name, timestamp FROM faces"):
        texts.append(f"{name} was registered at {ts}")
        meta.append({"name": name, "ts": ts})
    conn.close()

    if not texts:
        print("⚠️ No face data in DB yet. Vector index will not be built.")
        return False

    os.makedirs("data", exist_ok=True)
    FAISS.from_texts(texts, emb, metadatas=meta).save_local(VEC_DIR)
    print("✅ Vector index built successfully.")
    return True

# Build index only if it doesn't exist
if not os.path.exists(VEC_DIR):
    build_vector_index()

# Load vector index if available
qa = None
vec_db = None
if os.path.exists(VEC_DIR):
    vec_db = FAISS.load_local(VEC_DIR, emb, allow_dangerous_deserialization=True)
    qa = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model="gpt-4o", temperature=0),
        retriever=vec_db.as_retriever()
    )
else:
    print("⚠️ No vector index found. Chat will be disabled.")

# Define request model
class Query(BaseModel):
    query: str

# API route
@app.post("/chat")
async def chat(q: Query):
    if not qa:
        return {"answer": "⚠️ No data available. Please register at least one face first."}
    return {"answer": qa.run(q.query)}
