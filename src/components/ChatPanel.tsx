import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatPanel() {
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
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const threshold = 40;
    const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
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
        "Content-type": "application/json"
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
              prev.map((m) => (m.id === aiMessageId ? { ...m, text: m.text + token } : m))
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
    <div className="w-80 flex-shrink-0 flex flex-col h-full min-h-0 bg-background/60 backdrop-blur-xl border-l border-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-transparent">
        <h2 className="text-sm font-semibold text-foreground">
          Task Assistant
        </h2>
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${message.sender === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted/50 text-foreground rounded-tl-sm border border-border/50"
                }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-transparent border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI..."
            className="w-full text-sm rounded-full bg-muted/50 border-none px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
          <Button
            onClick={handleSend}
            size="icon"
            variant="ghost"
            className="absolute right-1.5 top-1.5 h-9 w-9 hover:bg-background/50 rounded-full text-muted-foreground hover:text-primary"
            disabled={inputValue.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
