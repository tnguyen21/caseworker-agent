from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from llama_index.llms.gemini import Gemini
from llama_index.core.llms import ChatMessage
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import logging
import yaml

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load system prompt
with open('prompts/section8_agent.yaml', 'r') as f:
    prompt_config = yaml.safe_load(f)
    SYSTEM_PROMPT = prompt_config['system_prompt']

app = FastAPI()

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.debug(f"Incoming {request.method} request to {request.url.path}")
    try:
        response = await call_next(request)
        logger.debug(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        raise

# Simplified CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = Gemini(
    model="models/gemini-1.5-flash",
    # api_key="" # uses GOOGLE_API_KEY env var by default
)

@app.post("/chat-stream")
async def chat_stream(request: Request):
    """
    Streams the response from LlamaIndex token-by-token.
    """
    logger.debug("Received request to /chat-stream")
    try:
        # Get raw request body
        body = await request.json()
        raw_messages = body.get("messages", [])
        logger.debug(f"Received raw messages: {raw_messages}")

        # Convert messages to ChatMessage objects, including system prompt
        chat_messages = [
            ChatMessage(role="system", content=SYSTEM_PROMPT),
            *[ChatMessage(role="user", content=msg) for msg in raw_messages]
        ]
        logger.debug(f"Converted to chat messages: {chat_messages}")

        async def response_generator(messages: List[ChatMessage]):
            try:
                response = llm.stream_chat(messages)
                for chunk in response:
                    if hasattr(chunk, 'delta'):
                        logger.debug(f"Streaming chunk delta: {chunk.delta[:50]}...")
                        yield chunk.delta
                    elif hasattr(chunk, 'message'):
                        logger.debug(f"Streaming chunk message: {chunk.message.content[:50]}...")
                        yield chunk.message.content
                    else:
                        logger.debug(f"Unknown chunk type: {type(chunk)}, attributes: {dir(chunk)}")
            except Exception as e:
                logger.error(f"Error in stream_chat: {str(e)}", exc_info=True)
                raise

        return StreamingResponse(
            response_generator(chat_messages),
            media_type="text/plain"
        )
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )

@app.get("/health")
async def health_check():
    return JSONResponse({"status": "ok"})

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PYTHON_BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
