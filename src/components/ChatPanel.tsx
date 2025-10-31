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

    let aiMessage : Message;

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "",
        sender: "ai",
        timestamp: new Date(),
      };
      // make the api request here
      setMessages((prev) => [...prev, aiMessage]);
      scrollToBottom();
    }, 1000);

    const userMessage2 = {
      id: Date.now(),
      text: inputValue,
    };
    console.log("Making the request to AI now....");

    const aiResponse = await fetch("/api/chatLLM", {
      method: "POST",
      body: JSON.stringify(userMessage2),
    });

    const readerStream = aiResponse.body?.getReader();
    const decoder = new TextDecoder();

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
          if(chunk.split('"type:"')[1] == null) {
            const aiMessage2 = chunk.split('"message":')[1].split('"')[1];

            setMessages((prev) =>
              prev.map((m) => {
                if(m.id == aiMessage.id) {
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
    <div className="w-80 flex-shrink-0 dark:bg-[#2d2d2d] flex flex-col bg-white m-0 h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#3d3d3d]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
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
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.sender === "user"
                  ? "bg-blue-300 text-gray-800 rounded-tr-none"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-[#3d3d3d]">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="w-full text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 pr-12 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 bg-white hover:bg-gray-100 rounded-full shadow-md border border-gray-300"
            disabled={inputValue.trim() === ""}
          >
            <Send className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
