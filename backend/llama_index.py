# llama_setup.py
from llama_index import SimpleDirectoryReader, GPTSimpleVectorIndex

def build_index() -> GPTSimpleVectorIndex:
    # Just an example to show how you might build or load your index
    documents = SimpleDirectoryReader('path_to_docs').load_data()
    index = GPTSimpleVectorIndex.from_documents(documents)
    return index

# Or if you already have an index saved to disk, you could:
# index = GPTSimpleVectorIndex.load_from_disk('my_index.json')
