
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import ChatMessage, { MessageRole } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { toast } from "@/components/ui/use-toast";

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

  const simulateResponse = async (userMessage: string) => {
    // This is a simulation function. In a real app, you would connect to an API
    setIsProcessing(true);
    
    // Add thinking state
    const thinkingId = generateId();
    setMessages(prev => [...prev, {
      id: thinkingId,
      role: "thinking",
      content: ""
    }]);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Remove thinking state and add response
    setMessages(prev => {
      // Filter out the thinking message
      const filteredMessages = prev.filter(m => m.id !== thinkingId);
      
      // Generate a simple response based on user message
      let responseContent = "";
      
      if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
        responseContent = "Hello there! How can I assist you today?";
      } else if (userMessage.toLowerCase().includes("help")) {
        responseContent = "I'd be happy to help! Please let me know what you need assistance with, and I'll do my best to provide relevant information or guidance.";
      } else if (userMessage.toLowerCase().includes("thank")) {
        responseContent = "You're welcome! If you have any more questions, feel free to ask.";
      } else if (userMessage.toLowerCase().includes("?")) {
        responseContent = "That's an interesting question. While I'm a simulated AI in this demo, a real AI system would provide a thoughtful response based on its training data and capabilities.";
      } else {
        responseContent = "Thank you for your message. This is a simulated response in this demo application. In a complete implementation, this would connect to an actual AI API like OpenAI's GPT models.";
      }
      
      return [...filteredMessages, {
        id: generateId(),
        role: "assistant",
        content: responseContent
      }];
    });
    
    setIsProcessing(false);
  };

  const handleSendMessage = (content: string) => {
    // Add user message
    const newMessage: Message = {
      id: generateId(),
      role: "user",
      content
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    simulateResponse(content).catch(error => {
      console.error("Error simulating response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    });
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
