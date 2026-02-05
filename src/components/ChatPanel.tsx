import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatPanelProps {
  onHide: () => void;
}

export default function ChatPanel({ onHide }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with your tasks today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
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

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      text: "",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInputValue("");
    setIsAtBottom(true);

    const aiResponse = await fetch("/api/chatLLM", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id: Date.now(), text: inputValue }),
    });

    const readerStream = aiResponse.body?.getReader();
    if (!readerStream) return;

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await readerStream.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const dataStr = trimmed.slice(5).trim();
          if (!dataStr || dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);
            const token = parsed?.token ?? parsed?.text ?? "";
            if (!token) continue;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMessageId ? { ...m, text: m.text + token } : m,
              ),
            );
          } catch {
            console.error("Bad SSE JSON:", dataStr);
          }
        }

        if (done) break;
      }
    } catch (error) {
      console.error("Stream reading error:", error);
    } finally {
      readerStream.releaseLock();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed backdrop-blur-sm shadow-sm ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-primary/80 to-primary/60 text-primary-foreground rounded-tr-sm border border-white/10 shadow-md shadow-primary/20"
                  : "bg-white/10 text-foreground rounded-tl-sm border border-white/15 shadow-sm"
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background/20 backdrop-blur-xl border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI..."
            className="w-full text-sm rounded-full bg-white/10 border border-white/10 px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all"
          />
          <Button
            onClick={handleSend}
            size="icon"
            variant="ghost"
            className="absolute right-1.5 top-1.5 h-9 w-9 hover:bg-white/10 rounded-full text-muted-foreground hover:text-primary"
            disabled={inputValue.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
