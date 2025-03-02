import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  className?: string;
}

// Sample prompts that users can click on
const samplePrompts = [
  "How do I file an emergency housing request?",
  "What documents are needed for SNAP benefits?",
  "How can I check the status of a case?"
];

const ChatInput = ({ onSendMessage, isProcessing, className }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showPrompts, setShowPrompts] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage("");
      setShowPrompts(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
    setShowPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className={cn(
      "w-full px-4 md:px-6 py-4 glass-effect border-t",
      "fixed bottom-0 left-0 right-0 z-10",
      className
    )}>
      <div className="max-w-3xl mx-auto relative">
        {showPrompts && (
          <div className="flex flex-wrap gap-2 mb-3 relative">
            <button 
              onClick={() => setShowPrompts(false)}
              className="absolute -top-2 -right-2 bg-background/80 rounded-full p-1 hover:bg-muted/80 transition-colors"
            >
              <X size={14} />
            </button>
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="px-3 py-1.5 rounded-full text-sm bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={isProcessing}
          className={cn(
            "w-full rounded-lg border border-border bg-background/60 py-3 pl-4 pr-12",
            "resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
            "placeholder:text-muted-foreground/60 shadow-sm",
            isProcessing && "opacity-70"
          )}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isProcessing}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md",
            "text-white bg-primary hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center"
          )}
        >
          <Send size={18} />
        </button>
      </div>
      <div className="max-w-3xl mx-auto mt-2">
        <p className="text-center text-xs text-muted-foreground">
          AI Assistant may produce inaccurate information about people, places, or facts.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
