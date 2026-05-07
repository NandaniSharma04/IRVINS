# from fastapi import FastAPI
# from pydantic import BaseModel
# from sentence_transformers import SentenceTransformer
# import numpy as np
# from numpy.linalg import norm


# app = FastAPI()
# model = SentenceTransformer('all-MiniLM-L6-v2')

# class TextInput(BaseModel):
#     text: str

# @app.post("/embed")
# def get_embedding(input: TextInput):
#     embedding = model.encode(input.text).tolist()
#     return {"embedding": embedding}

# @app.post("/embed-and-similarity")
# def get_embedding_and_similarity(input: TextInput):
#     # embedding
#     embedding = model.encode(input.text).tolist()

#     # cosine similarity with some stored vector (example)
#     v1 = np.array(embedding)
#     v2 = v1  # or fetch from DB
#     sim = np.dot(v1, v2) / (norm(v1) * norm(v2))

#     return {
#         "embedding": embedding,
#         "cosine_similarity": sim
#     }

from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

class TextInput(BaseModel):
    text: str

@app.post("/embed")
def get_embedding(input: TextInput):
    embedding = model.encode(input.text, normalize_embeddings=True).tolist()
    return {"embedding": embedding}