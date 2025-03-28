import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Conversation model
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull().default("New Conversation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  title: true,
});

// Message model
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: serial("conversation_id").references(() => conversations.id),
  content: text("content").notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isStreamed: varchar("is_streamed", { length: 5 }).default("false"),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
  isStreamed: true,
});

// Export types
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
