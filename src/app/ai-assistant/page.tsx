"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  MapPin, 
  Utensils, 
  Tv, 
  AlertTriangle,
  User,
  Info,
  Clock,
  Compass
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AIAssistantPage() {
  const { voiceNavigation } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: "Hello! Welcome to SoFi Stadium. I am your StadiumOS AI Companion. Ask me anything about seat navigation, food options, restrooms, or transportation hubs. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.content || "I apologize, but I encountered a processing error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `msg-${Date.now() + 2}`,
        role: "assistant",
        content: "Network connectivity issue detected. Running fallback operations: Restrooms are located behind Sections 105, 112, 124. Nearest Gate is Gate B.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const triggerVoiceListen = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate speaking "where is my seat"
      handleSend("Where is Section 104 and how do I find my seat?");
    } else {
      setIsListening(true);
      setError("");
    }
  };

  const quickPrompts = [
    { label: "Find Section 104 Seat", text: "How do I find my seat in Section 104?", icon: <MapPin className="w-3.5 h-3.5" /> },
    { label: "Best Tacos Kiosk", text: "What taco stands are near Section 104?", icon: <Utensils className="w-3.5 h-3.5" /> },
    { label: "Restroom Status", text: "Where is the closest washroom to Section 104?", icon: <Info className="w-3.5 h-3.5" /> },
    { label: "Trigger Medical Alarm", text: "Help, emergency! Someone collapsed in Section 104.", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  const [error, setError] = useState("");

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-100px)]">
      
      {/* Left panel: Info & Prompts */}
      <div className="md:col-span-1 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Fan Assistant
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Gemini-Powered Fan Liaison</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Quick Prompts</span>
            <div className="space-y-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="w-full p-2.5 rounded-lg border border-white/5 bg-white/2.5 hover:bg-white/5 hover:border-purple-500/20 text-left text-xs text-white transition flex items-start gap-2 cursor-pointer group"
                >
                  <span className="text-purple-400 group-hover:scale-110 transition-transform mt-0.5">{p.icon}</span>
                  <span className="leading-tight font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accessibility status block */}
        <GlassCard className="p-3.5 space-y-2 text-xs">
          <h4 className="font-bold text-white flex items-center gap-1">
            <Compass className="w-4 h-4 text-blue-400" />
            Accessibility Assist
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {voiceNavigation 
              ? "Voice response active. Assistant answers will be read aloud." 
              : "Standard text chat mode active. Toggle audio icon in the top header for screen reader speech feedback."}
          </p>
        </GlassCard>
      </div>

      {/* Right panel: Main Conversation Panel */}
      <GlassCard className="md:col-span-3 flex flex-col justify-between overflow-hidden h-full" glow>
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Liaison Terminal</span>
          </div>
          <Badge variant="info">English + 30 Languages</Badge>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar bubble */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs shrink-0 select-none ${
                  isUser 
                    ? "bg-purple-600/10 border-purple-500/30 text-purple-300" 
                    : "bg-blue-600/10 border-blue-500/30 text-blue-300"
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : "🤖"}
                </div>
                
                {/* Message Box */}
                <div className={`p-3.5 rounded-xl text-xs space-y-1 ${
                  isUser 
                    ? "bg-purple-600/15 border border-purple-500/20 text-white rounded-tr-none" 
                    : "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none whitespace-pre-line"
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className="text-[9px] text-muted-foreground block text-right font-medium">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-blue-600/10 border-blue-500/30 text-blue-300 text-xs shrink-0">
                🤖
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-200"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
          {isListening && (
            <div className="flex justify-center items-center gap-1.5 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-300 text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              <span>Listening to voice query... Speak now. (Click Mic again to complete)</span>
              
              {/* Simulated Sound Wave bar visualizer */}
              <div className="flex gap-0.5 items-end h-3 ml-2">
                <div className="w-0.5 h-2 bg-purple-400 animate-bounce"></div>
                <div className="w-0.5 h-3 bg-purple-400 animate-bounce delay-75"></div>
                <div className="w-0.5 h-1.5 bg-purple-400 animate-bounce delay-150"></div>
                <div className="w-0.5 h-2.5 bg-purple-400 animate-bounce delay-100"></div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={triggerVoiceListen}
              className={`p-2.5 rounded-lg border transition cursor-pointer ${
                isListening
                  ? "bg-purple-600 border-purple-500 text-white animate-pulse"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground hover:text-white"
              }`}
              title="Voice Speech Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder="Ask anything (e.g. 'Directions to seat Section 104', 'Closest bathroom')"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
              className="flex-1 glass-input rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              disabled={loading}
            />

            <button
              onClick={() => handleSend(inputValue)}
              className="p-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition cursor-pointer"
              disabled={loading}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </GlassCard>

    </div>
  );
}
