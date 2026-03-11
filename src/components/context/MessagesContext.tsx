import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { MessagesContext } from "./MessagesContextDef.ts";
import type { MessageTag, Message } from "./MessagesContextDef.ts";
import "../../assets/stylesheets/messages.css";

let _nextId = 0;

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((text: string, tag: MessageTag = "info") => {
    const id = _nextId++;
    setMessages((prev) => [...prev, { id, text, tag }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 4000);
  }, []);

  return (
    <MessagesContext.Provider value={{ addMessage }}>
      {children}
      <MessageList messages={messages} />
    </MessagesContext.Provider>
  );
}

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) return null;
  return (
    <ul className="messages">
      {messages.map((m) => (
        <li key={m.id} className={`message ${m.tag}`}>
          {m.text}
        </li>
      ))}
    </ul>
  );
}