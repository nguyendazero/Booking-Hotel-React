import { useState, useRef, useEffect } from "react";
import { Button, Input } from "antd";
import { MessageCircle, Minus } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newUserMessage = { text: inputValue, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/public/ask-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: inputValue }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const geminiAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text;

      const newBotMessage = {
        text: geminiAnswer || "Sorry, I don't understand your question.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "An error occurred while connecting to AI. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          // Sử dụng MessageCircle icon
          icon={<MessageCircle size={28} />}
          onClick={() => setIsOpen(true)}
          className="shadow-lg !w-14 !h-14 flex items-center justify-center !bg-violet-600 hover:!bg-violet-700 transition-colors duration-200 focus:!ring-violet-500 focus:!ring-offset-2"
          aria-label="Mở Chatbot"
        />
      )}

      {isOpen && (
        <div className="flex flex-col w-[350px] h-[500px] border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden">
          <div className="bg-violet-600 text-white p-4 text-lg font-semibold rounded-t-lg flex justify-between items-center">
            <h2>AI Chat Assistant</h2>
            <Button
              type="text"
              // Sử dụng Minus icon
              icon={<Minus size={20} className="text-white" />}
              onClick={() => setIsOpen(false)}
              className="!text-white hover:!text-gray-200"
              aria-label="Minimize Chatbot"
            />
          </div>
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-2 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-xl leading-snug break-words ${
                  message.sender === "user"
                    ? "self-end bg-violet-100 text-gray-800 rounded-br-md"
                    : "self-start bg-green-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-gray-200 p-3 rounded-xl flex items-center space-x-1 animate-pulse">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSendMessage}
            className="flex p-4 border-t border-gray-200 bg-white"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your message..."
              className="flex-grow mr-3 focus:!ring-violet-500"
              disabled={isLoading}
            />
            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              className="!bg-violet-600 hover:!bg-violet-700 disabled:!bg-gray-400 disabled:!cursor-not-allowed"
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
