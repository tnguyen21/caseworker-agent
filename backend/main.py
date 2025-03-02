from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from llama_index.llms.gemini import Gemini
from llama_index.core.llms import ChatMessage
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import logging
import yaml
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, get_response_synthesizer
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.chat_engine import CondenseQuestionChatEngine
# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load system prompt
with open('../prompts/section8_agent.yaml', 'r') as f:
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
    allow_origins=["*", "http://localhost:8080"],  # Allow all origins + explicitly add Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = Gemini(
    model="models/gemini-2.0-flash-thinking-exp-01-21",
    temperature=0.0,
    # api_key="" # uses GOOGLE_API_KEY env var by default
)


# build index
documents = SimpleDirectoryReader(
    "../Section8-Resources"
).load_data()
index = VectorStoreIndex.from_documents(documents)

# configure retriever
retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=5,
)

query_engine = index.as_query_engine()


chat_engine = CondenseQuestionChatEngine.from_defaults(
    query_engine=query_engine,
    condense_question_prompt=SYSTEM_PROMPT,
    verbose=True,
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
                # Extract the last user message as the query string
                query_str = messages[-1].content if messages and messages[-1].role == "user" else ""
                
                # Use the query string instead of passing the messages directly
                streaming_response = chat_engine.stream_chat(query_str)
                
                # Access the response_gen attribute for the actual generator
                # Use a regular for loop since it's not an async generator
                for token in streaming_response.response_gen:
                    logger.debug(f"Streaming token: {token[:50] if token else ''}...")
                    yield token
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
