import os
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain.chains import RetrievalQA
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import CSVLoader

# ✅ Set your Cerebras Cloud API key and endpoint
os.environ["OPENAI_API_KEY"] = "your_cerebras_api_key_here"  # Replace with your actual key
os.environ["OPENAI_API_BASE"] = "https://api.cerebras.net/v1"

# ✅ Load CSV file containing face recognition logs
loader = CSVLoader(file_path="logs.csv")
docs = loader.load()

# ✅ Split the documents into chunks
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
documents = text_splitter.split_documents(docs)

# ✅ Initialize embeddings with Cerebras endpoint
embedding = OpenAIEmbeddings(
    openai_api_key=os.environ["OPENAI_API_KEY"],
    openai_api_base=os.environ["OPENAI_API_BASE"]
)

# ✅ Create FAISS vectorstore from documents
db = FAISS.from_documents(documents, embedding)

# ✅ Set up retriever
retriever = db.as_retriever()

# ✅ Initialize the LLM from Cerebras
llm = ChatOpenAI(
    openai_api_key=os.environ["OPENAI_API_KEY"],
    openai_api_base=os.environ["OPENAI_API_BASE"]
)

# ✅ Build the RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)

# ✅ Example Query
query = "Who was the last person registered?"
result = qa_chain.invoke(query)

print("Answer:", result["result"])
