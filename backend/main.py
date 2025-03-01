# main.py
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from llama_setup import build_index

app = FastAPI()

# Build or load your index (e.g., globally or in a startup event)
index = build_index()

@app.get("/chat-stream")
async def chat_stream(query: str):
    """
    Streams the response from LlamaIndex token-by-token (or chunk-by-chunk).
    The front-end can subscribe to this endpoint to get partial updates.
    """
    async def response_generator(query: str):
        # Create a LlamaIndex query engine with streaming turned on if supported.
        # Or yield partial tokens from your LLM's streaming function.
        # The specifics of streaming depends on the underlying LLM's API.
        
        # This pseudocode assumes some 'stream_query' interface:
        # for token in index.query(query, stream=True):
        #     yield token
        
        # The actual method can differ depending on the LlamaIndex version
        # and the underlying LLM. For demonstration, let's simulate chunked output:
        
        response_chunks = ["Hello, ", "this ", "is ", "a ", "streamed ", "LLM ", "response!"]
        for chunk in response_chunks:
            yield chunk
            # An async sleep or real-time token generation might happen here.

    return StreamingResponse(response_generator(query), media_type="text/plain")
