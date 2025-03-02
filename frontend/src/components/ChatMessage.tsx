import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export type MessageRole = "user" | "assistant" | "thinking";

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  isNew?: boolean;
}

const ChatMessage = ({ role, content, isNew = false }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNew && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNew]);

  if (role === "thinking") {
    return (
      <div 
        ref={messageRef}
        className={cn(
          "py-6 px-6 md:px-8 flex animate-appear",
          "bg-chat-thinking border-b border-border/40"
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center">
          <span className="text-white font-medium text-sm">AI</span>
        </div>
        <div className="ml-4 flex-1">
          <div className="typing-indicator mt-3">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messageRef}
      className={cn(
        "py-6 px-6 md:px-8 flex animate-appear",
        role === "user" ? "bg-chat-user" : "bg-chat-assistant",
        "border-b border-border/40"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        role === "user" 
          ? "bg-gradient-to-tr from-blue-500 to-indigo-600" 
          : "bg-gradient-to-tr from-indigo-500 to-blue-500"
      )}>
        <span className="text-white font-medium text-sm">
          {role === "user" ? "U" : "AI"}
        </span>
      </div>
      <div className="ml-4 flex-1">
        <div className="markdown-container">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
