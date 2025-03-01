
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn(
      "w-full glass-effect border-b z-10 px-6 py-3 flex items-center justify-between",
      "fixed top-0 left-0 right-0",
      className
    )}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center">
          <span className="text-white font-medium text-sm">AI</span>
        </div>
        <h1 className="text-lg font-medium">Chat Assistant</h1>
      </div>
      
      <button className="text-sm px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
        New Chat
      </button>
    </header>
  );
};

export default Header;
