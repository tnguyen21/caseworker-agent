import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import ChatMessage, { MessageRole } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { toast } from "@/components/ui/use-toast";

// API configuration
const API_BASE_URL = "https://caseworker-agent.fly.dev";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "Hello! I'm your AI caseworker. How can I help you today?"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const streamResponse = async (userMessage: string) => {
    setIsProcessing(true);
    
    // Add thinking state
    const responseId = generateId();
    setMessages(prev => [...prev, {
      id: responseId,
      role: "assistant",
      content: ""
    }]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [userMessage]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let accumulatedContent = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the stream chunk and append to accumulated content
        const text = new TextDecoder().decode(value);
        accumulatedContent += text;
        
        // Update the message with accumulated content
        setMessages(prev => prev.map(msg => 
          msg.id === responseId 
            ? { ...msg, content: accumulatedContent }
            : msg
        ));
      }
    } catch (error) {
      console.error("Error getting streaming response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      // Remove the incomplete message on error
      setMessages(prev => prev.filter(msg => msg.id !== responseId));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = (content: string) => {
    // Add user message
    const newMessage: Message = {
      id: generateId(),
      role: "user",
      content
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Get streaming response
    streamResponse(content);
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-32 pt-16">
        <div className="relative mx-auto max-w-4xl">
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id}
                role={message.role}
                content={message.content}
                isNew={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default Index;
