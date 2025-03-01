# main.py
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from llama_setup import build_index
import os

app = FastAPI()

# Build or load your index (e.g., globally or in a startup event)
index = build_index()

@app.get("/health")
async def health_check():
    """
    Health check endpoint for Fly.io
    """
    return JSONResponse({"status": "ok"})

@app.get("/chat-stream")
async def chat_stream(query: str):
    """
    Streams the response from LlamaIndex token-by-token (or chunk-by-chunk).
    The front-end can subscribe to this endpoint to get partial updates.
    """
    async def response_generator(query: str):
        # Simplified response generator for demonstration
        response_chunks = ["Hello, ", "this ", "is ", "a ", "streamed ", "response!"]
        for chunk in response_chunks:
            yield chunk

    return StreamingResponse(response_generator(query), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PYTHON_BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
