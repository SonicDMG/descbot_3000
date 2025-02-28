
import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import MarkdownDisplay from './MarkdownDisplay';
import { Message } from '@/types/chat';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

// Mock data for demo purposes
const SAMPLE_MARKDOWN = `# Master Tool Calling with Ollama! 🤖🔧

Join Developer Relations Engineer David Jones-Gilardi as he walks you through the process of tool calling with agents using Ollama. Discover how to run local models on your machine, ensuring data privacy and control while leveraging AI's power. Perfect for developers looking to enhance their applications with dynamic and interactive agents!

## Resources

* Ollama: https://ollama.com

## Stay in Touch

* Join our Discord Community: /discord
* Follow us on X: https://twitter.com/ollama_ai

## Chapters

* 00:00:00 | 🌟 Introduction by David Jones-Gilardi
* 00:00:09 | 💡 Why Use Ollama?
* 00:00:30 | 🔧 Installing and Running Models
* 00:00:51 | 📝 Setting Up an Agent
* 00:01:24 | 🔍 Understanding Tool Calling
* 00:01:57 | 🚀 Deploying Your Agent
* 00:02:27 | 🏆 Best Practices for Agents
* 00:02:48 | 🎬 Conclusion and Happy Coding

#Ollama #ToolCalling #AI #DataPrivacy #DeveloperTutorial`;

const ChatbotApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [markdownContent, setMarkdownContent] = useState(SAMPLE_MARKDOWN);
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, you would connect this to your backend/API
  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the message to your backend
      // and get a response
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: `I received your message: "${content}"\n\nThis is a demonstration of the chat interface. In a real application, this would connect to your Python backend.` 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate new markdown content based on the message
      if (content.toLowerCase().includes('markdown') || content.toLowerCase().includes('document')) {
        setMarkdownContent(SAMPLE_MARKDOWN);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearHistory = () => {
    setMessages([]);
    toast.success("Chat history cleared");
  };
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
          <Button 
            variant="ghost" 
            className="bg-white/5 hover:bg-white/10 text-white rounded-full px-4 py-2 flex items-center gap-2"
            onClick={clearHistory}
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear History</span>
          </Button>
        </motion.div>
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <ChatInterface 
          onSendMessage={handleSendMessage} 
          messages={messages}
          isLoading={isLoading}
        />
        <MarkdownDisplay content={markdownContent} />
      </div>
    </div>
  );
};

export default ChatbotApp;
