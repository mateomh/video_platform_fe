import { useContext } from "react";
import { MessagesContext } from "./MessagesContextDef.ts";
import type { MessagesContextType } from "./MessagesContextDef.ts";

export function useMessages(): MessagesContextType {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used inside <MessagesProvider>");
  return ctx;
}