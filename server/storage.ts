import { 
  conversations, 
  type Conversation, 
  type InsertConversation,
  messages,
  type Message,
  type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private conversationIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.conversationIdCounter = 1;
    this.messageIdCounter = 1;
  }

  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationIdCounter++;
    const createdAt = new Date();
    const conversation: Conversation = { 
      id, 
      title: insertConversation.title || "New Conversation",
      createdAt 
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    const allMessages = Array.from(this.messages.values());
    return allMessages
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const createdAt = new Date();
    
    if (!insertMessage.conversationId) {
      throw new Error("Message must have a conversation ID");
    }
    
    const message: Message = { 
      id,
      conversationId: insertMessage.conversationId,
      content: insertMessage.content,
      role: insertMessage.role,
      isStreamed: insertMessage.isStreamed || null,
      createdAt
    };
    
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
