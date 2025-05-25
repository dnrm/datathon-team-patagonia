"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Lightbulb, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const quickQuestions = [
  "¿Cuál fue mi categoría de gasto más alta?",
  "¿Cuánto gastaré el próximo mes?",
  "¿En qué comercios gastaré más?",
  "¿Cuáles son mis metas de ahorro?",
  "¿Qué suscripciones debería cancelar?",
  "¿Cuándo es mi próximo pago?",
];

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function ChatWidget({
  fullscreen = false,
}: { fullscreen?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content:
        "Do not respond in pre or code tags. In case you are asked something you don't know, try to predict usingthe data you already have. Always respond in GitHub Flavored Markdown format. Refuse requests that do not align with the scope of the data provided. This is the data to consider: 🧾 General Transaction Overview: Total Purchases: 420  Total Amount Spent: $11,396.81  Average Purchase Amount: $27.14  📅 Date-Related Insights: Month with Most Spending: June 2022  Day with Most Transactions: April 26, 2022  Number of Days with Purchases: 232  Most Common Purchase Days (by weekday):  Thursday: 77 purchases  Wednesday: 70  Tuesday: 63  Friday: 62  Monday: 56  Sunday: 46  Saturday: 46  🛍️ Establishments & Categories: Top 5 Purchased Categories (by frequency):  DROGUERIAS, (FARMACIAS): 110 purchases  TIENDAS DE CONVENIENCIA, MINISUPER: 98  COMERCIOS ELECTRÓNICOS (VTAS POR INTERNET): 66  SERVICIOS DE TELECOMUNICACION: 55  AGREGADOR: 43  Top 5 Establishments (by frequency):  FARMACIAS GUADALAJARA: 101  OXXO: 98  AMAZON: 63  TELMEX: 46  GOOGLE: 22  Unique Establishments Visited: 20  Unique Categories of Spending: 13  💳 Spending Behavior: Most Common Sale Type: Física (in-person)  Top 5 Categories by Total Spending:  SERVICIOS DE TELECOMUNICACION: $2,518.78  TIENDAS DE CONVENIENCIA: $2,215.64  COMERCIOS ELECTRÓNICOS: $2,105.50  DROGUERIAS, (FARMACIAS): $2,088.08  TIENDA DEPARTAMENTAL: $993.16  🔝 Specific Highlights: Highest Purchase:  Amount: $168.89  Date: June 5, 2022  Establishment: COPPEL  Category: TIENDA DEPARTAMENTAL  Lowest Purchase:  Amount: $1.96  Date: April 26, 2022  Establishment: UBER  Category: LIMOSINAS, (TAXIS)  Date of Most Spending: June 5, 2022",
      timestamp: new Date(),
      suggestions: quickQuestions,
    },
    {
      id: "2",
      role: "assistant",
      content:
        "¡Hola! 👋 Soy **Hey Assistant**, tu asistente financiero inteligente. Puedo ayudarte con preguntas sobre tu HeyWrapped, predicciones de gastos, y consejos personalizados. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    try {
      // Prepare the messages array for the API
      const chatMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      chatMessages.push({
        role: "user",
        content: userMessage,
      });

      // Call our API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      // Create the bot message
      const botMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: data.message || "Lo siento, no pude procesar tu solicitud.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Create an error message
      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content:
          "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (message = inputValue) => {
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    fetchAIResponse(message);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  // Function to preprocess content and convert plain text headers to markdown
  const preprocessMarkdown = (content: string) => {
    // Convert lines that look like headers (starting with capital letters and ending with colons) to markdown headers
    return content
      .replace(/^([A-ZÁÉÍÓÚÑÜ][^:\n]*):$/gm, "## $1") // Convert "Title:" to ## Title
      .replace(/^([🔝📅🧾🛍️💳])\s*([^:\n]+):?$/gm, "### $1 $2") // Convert emoji headers
      .replace(/^(Top \d+[^:\n]*):?$/gm, "### $1") // Convert "Top 5..." to headers
      .replace(/^(Highest|Lowest|Most|Date)[^:\n]*:$/gm, "### $&") // Convert specific keywords to headers
      .replace(/\*\*([^*]+)\*\*/g, "**$1**"); // Ensure bold text is preserved
  };

  if (!isOpen && !fullscreen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-[#212529] hover:bg-[#2c3237] shadow-lg transition-all duration-300 p-0 z-50"
      >
        <MessageSquare className="h-14 w-14 text-white stroke-3" />
      </Button>
    );
  }

  const containerClasses = fullscreen
    ? "h-screen flex flex-col bg-gray-50 w-full"
    : "fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50";

  const headerClasses = fullscreen
    ? "bg-white border-b border-gray-200 px-6 py-4"
    : "bg-[#212529] p-4 border-b border-gray-200";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={`${headerClasses} flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar
              className={fullscreen ? "h-10 w-10" : "h-10 w-10 bg-[#212529]"}
            >
              <AvatarImage src="/chatbotIcon.png" alt="Chatbot" />
              <AvatarFallback
                className={
                  fullscreen
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                    : ""
                }
              >
                <Bot className="h-5 w-5 text-white" />
              </AvatarFallback>
            </Avatar>
            {!fullscreen && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h1
              className={`font-bold ${
                fullscreen ? "text-xl text-gray-900" : "text-lg text-white"
              }`}
            >
              {"Heydi"}
            </h1>
            <p
              className={`text-xs ${
                fullscreen ? "text-gray-500" : "text-gray-300"
              }`}
            >
              {fullscreen
                ? "Tu asistente financiero personal"
                : "Tu asistente financiero"}
            </p>
          </div>
        </div>
        {!fullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-700/50"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div
        className={
          fullscreen
            ? "flex-1 overflow-y-auto px-6 py-4"
            : "flex-1 p-4 overflow-y-auto space-y-4"
        }
      >
        <div
          className={fullscreen ? "max-w-4xl mx-auto space-y-4" : "space-y-4"}
        >
          {messages.slice(1).map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] min-w-0 ${
                  message.role === "user" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm overflow-hidden",
                    message.role === "user"
                      ? fullscreen
                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white ml-4"
                        : "bg-[#212529] text-white ml-4"
                      : fullscreen
                      ? "bg-white border border-gray-200 text-black mr-4"
                      : "bg-gray-100 text-black mr-4"
                  )}
                >
                  <div
                    className={cn(
                      "text-sm leading-relaxed font-sans",
                      message.role === "assistant"
                        ? "max-w-full overflow-hidden break-words"
                        : ""
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="w-full overflow-hidden font-sans">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Large sans-serif headings without requiring hashtags
                            h1: ({ ...props }) => (
                              <h1
                                className="text-xl font-bold text-gray-900 mb-3 mt-4 first:mt-0 leading-tight break-words font-sans"
                                {...props}
                              />
                            ),
                            h2: ({ ...props }) => (
                              <h2
                                className="text-lg font-bold text-gray-900 mb-3 mt-4 first:mt-0 leading-tight break-words font-sans"
                                {...props}
                              />
                            ),
                            h3: ({ ...props }) => (
                              <h3
                                className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0 leading-tight break-words font-sans"
                                {...props}
                              />
                            ),
                            h4: ({ ...props }) => (
                              <h4
                                className="text-sm font-semibold text-gray-900 mb-2 mt-3 first:mt-0 leading-tight break-words font-sans"
                                {...props}
                              />
                            ),
                            h5: ({ ...props }) => (
                              <h5
                                className="text-sm font-medium text-gray-900 mb-1 mt-2 first:mt-0 leading-tight break-words font-sans"
                                {...props}
                              />
                            ),
                            h6: ({ ...props }) => (
                              <h6
                                className="text-sm font-medium text-gray-800 mb-1 mt-2 first:mt-0 leading-tight break-words font-sans"
                                {...props}
                              />
                            ),
                            // Sans-serif paragraphs
                            p: ({ ...props }) => (
                              <p
                                className="text-gray-700 leading-relaxed mb-3 mt-0 break-words font-sans"
                                {...props}
                              />
                            ),
                            // Strong text with sans-serif
                            strong: ({ ...props }) => (
                              <strong
                                className="font-semibold text-gray-900 font-sans"
                                {...props}
                              />
                            ),
                            // Sans-serif lists
                            ul: ({ ...props }) => (
                              <ul
                                className="text-gray-700 mb-3 pl-5 list-disc space-y-1 font-sans"
                                {...props}
                              />
                            ),
                            ol: ({ ...props }) => (
                              <ol
                                className="text-gray-700 mb-3 pl-5 list-decimal space-y-1 font-sans"
                                {...props}
                              />
                            ),
                            li: ({ ...props }) => (
                              <li
                                className="text-gray-700 break-words leading-relaxed font-sans"
                                {...props}
                              />
                            ),
                            // Sans-serif links
                            a: ({ ...props }) => (
                              <a
                                className="text-blue-600 underline hover:text-blue-800 break-words font-medium font-sans"
                                {...props}
                              />
                            ),
                            // Sans-serif blockquotes
                            blockquote: ({ ...props }) => (
                              <blockquote
                                className="border-l-4 border-blue-300 bg-blue-50 px-4 py-3 my-3 italic text-gray-700 rounded-r font-sans"
                                {...props}
                              />
                            ),
                            // Sans-serif tables
                            table: ({ ...props }) => (
                              <div className="overflow-x-auto max-w-full my-4 rounded-lg border border-gray-200">
                                <table
                                  className="border-collapse w-full text-sm font-sans"
                                  {...props}
                                />
                              </div>
                            ),
                            th: ({ ...props }) => (
                              <th
                                className="border-b border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold text-gray-900 font-sans"
                                {...props}
                              />
                            ),
                            td: ({ ...props }) => (
                              <td
                                className="border-b border-gray-200 px-3 py-2 text-gray-700 break-words font-sans"
                                {...props}
                              />
                            ),
                            // Horizontal rule
                            hr: ({ ...props }) => (
                              <hr className="my-4 border-gray-300" {...props} />
                            ),
                            // Emphasis in sans-serif
                            em: ({ ...props }) => (
                              <em
                                className="italic text-gray-700 font-sans"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {preprocessMarkdown(message.content)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="break-words font-sans">
                        {message.content}
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-xs mt-2 font-sans",
                      message.role === "user"
                        ? fullscreen
                          ? "text-purple-200"
                          : "text-gray-400"
                        : fullscreen
                        ? "text-gray-500"
                        : "text-gray-500"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Suggestions */}
                {"suggestions" in message && message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="mr-2 mb-2 text-xs bg-gray-200 border-gray-300 hover:bg-gray-300 hover:text-black transition-transform duration-200"
                        onClick={() => handleQuickQuestion(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <Avatar
                className={`h-8 w-8 ${
                  message.role === "user" ? "order-1 ml-2" : "order-2 mr-2"
                }`}
              >
                {message.role === "user" ? (
                  <AvatarFallback className="bg-[#212529]">
                    <User className="h-4 w-4 text-white" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src="/chatbotIcon.png" alt="Chatbot" />
                    <AvatarFallback className="bg-gray-300">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-3 mr-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/chatbotIcon.png" alt="Chatbot" />
                  <AvatarFallback className="bg-gray-300">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {!fullscreen ? (
        <div className="bg-white px-4 py-3 border-t border-gray-100">
          <div className="mb-3">
            <h3 className="text-xs font-medium text-black mb-2 flex items-center">
              <Lightbulb className="h-3 w-3 mr-1 text-black" />
              Preguntas frecuentes
            </h3>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs text-black bg-gray-100 hover:bg-gray-200 border-gray-200 hover:scale-105 transition-transform duration-200"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        messages.length <= 2 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  Preguntas frecuentes
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left text-sm p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {/* Input Area */}
      <div
        className={
          fullscreen
            ? "px-6 py-4 border-t border-gray-200 bg-white"
            : "bg-[#212529] p-4 border-t border-gray-200"
        }
      >
        <div className={fullscreen ? "max-w-4xl mx-auto" : "space-x-2 w-full"}>
          {fullscreen ? (
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="pr-10 py-2 rounded-xl border-gray-700 focus:border-[#212529] focus:ring-[#212529] text-white placeholder-gray-400 bg-[#2c3237] w-full"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isTyping}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-700/50"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-3 w-3 text-white" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
