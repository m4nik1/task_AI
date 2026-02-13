import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useChat } from "@ai-sdk/react";

interface ChatPanelProps {
  onHide: () => void;
}

export default function ChatPanel({ onHide }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage } = useChat();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const messagesContainerRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const threshold = 40;
    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold;
    setIsAtBottom(atBottom);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom(false);
    }
  }, [messages, isAtBottom, scrollToBottom]);

  return (
    <div className="relative w-80 flex-shrink-0 flex flex-col h-full min-h-0 bg-background/40 backdrop-blur-2xl border-l border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-slate-200/20 before:via-slate-200/10 before:to-transparent before:content-['']">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-background/30 backdrop-blur-md shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Task Assistant
        </h2>
        <Button
          onClick={onHide}
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10"
          aria-label="Hide chat panel"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-5 bg-gradient-to-b from-slate-200/10 to-transparent"
      >
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? "User" : "AI"}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
      </div>

      <div className="p-4 bg-background/20 backdrop-blur-xl border-t border-white/10">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage({ text: inputValue });
            setInputValue("");
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask AI..."
            className="w-full text-sm rounded-full bg-white/10 border border-white/10 px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all"
          />
        </form>
      </div>
    </div>
  );
}
