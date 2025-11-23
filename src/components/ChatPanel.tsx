import { useState, useRef } from "react";
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
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    let aiMessage: Message;

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    aiMessage = {
      id: (Date.now() + 1).toString(),
      text: "",
      sender: "ai",
      timestamp: new Date(),
    };


    setTimeout(() => {
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "",
        sender: "ai",
        timestamp: new Date(),
      };


      // Make the api request here
      setMessages((prev) => [...prev, aiMessage]);
      scrollToBottom();
    }, 1000);

    const userMessage2 = {
      id: Date.now(),
      text: inputValue,
    };
    console.log("Making the request to AI now....");

    const aiResponse = await fetch("/api/chatLLM", {
      headers: {
        "Content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(userMessage2),
    });


    const readerStream = aiResponse.body?.getReader();

    if (!readerStream) return;
    const decoder = new TextDecoder();

    console.log("Reader: ", readerStream);


    try {
      while (true) {
        const { done, value } = await readerStream.read();
        if (done) {
          // When the stream is done, flush any remaining bytes in the decoder
          const finalChunk = decoder.decode();
          if (finalChunk) {
            console.log("Final chunk: ", finalChunk);
          }
          break;
        }

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const messageObj = JSON.parse(chunk.split('text:')[1]).text

          if (messageObj != null) {
            const aiMessage2 = messageObj

            setMessages((prev) =>
              prev.map((m) => {
                if (m.id == aiMessage.id) {
                  return { ...m, text: m.text + aiMessage2 }
                } else {
                  return m;
                }
              })
            );
          }
        }
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
    <div className="w-80 flex-shrink-0 flex flex-col h-full bg-background border-l border-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50 backdrop-blur-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Task Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${message.sender === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm"
                }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI..."
            className="w-full text-sm rounded-full bg-muted border-none px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
          <Button
            onClick={handleSend}
            size="icon"
            variant="ghost"
            className="absolute right-1.5 top-1.5 h-9 w-9 hover:bg-background rounded-full text-muted-foreground hover:text-primary"
            disabled={inputValue.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
