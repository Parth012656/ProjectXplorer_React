import React, { useEffect, useRef, useState } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { AuthUser } from '../types';

interface Message {
  sender: 'user' | 'bot' | 'system';
  text: string;
  source?: string;
  confidence?: number;
}

const API_URL = process.env.REACT_APP_API_URL + '/api/propy/ask';

const PropyChatbot: React.FC<{ user: AuthUser | null }> = ({ user }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = !!(user?.isAuthenticated || localStorage.getItem('token'));

  useEffect(() => {
    if (tooltip) {
      const t = setTimeout(() => setTooltip(null), 3000);
      return () => clearTimeout(t);
    }
  }, [tooltip]);

  useEffect(() => {
    // auto-scroll when messages change
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Hide on auth pages
  const hiddenPaths = ['/login', '/signup', '/register'];
  if (hiddenPaths.includes(location.pathname)) return null;

  const openChat = () => {
    if (!isLoggedIn) {
      setTooltip('Please sign in to use Propy.');
      return;
    }
    setOpen(true);
  };

  const closeChat = () => setOpen(false);

  const sendQuery = async () => {
    const query = input.trim();
    if (!query) return;
    const userMsg: Message = { sender: 'user', text: query };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMsg: Message = {
        sender: 'bot',
        text: data.answer || "Propy didn't understand that.",
        source: data.source,
        confidence: data.confidence,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      console.error('Propy error', err);
      setMessages((m) => [...m, { sender: 'system', text: 'Server is unavailable. Please try later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendQuery();
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 60 }}>
        <button
          onClick={openChat}
          aria-label="Open Propy chat"
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transform transition-transform duration-200 hover:scale-105 animate-bounce"
        >
          <FaRobot />
        </button>

        {/* Tooltip for non-logged-in users */}
        {tooltip && (
          <div className="mt-2 p-2 bg-white text-sm text-gray-800 rounded shadow">
            {tooltip}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div style={{ position: 'fixed', bottom: 110, right: 30, zIndex: 70 }}>
          <div className="w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col" style={{ minHeight: 320 }}>
            <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <FaRobot />
                <div className="font-semibold">Propy</div>
              </div>
              <button onClick={closeChat} aria-label="Close chat" className="opacity-90 hover:opacity-100">
                <FaTimes />
              </button>
            </div>

            <div className="p-3 flex-1 overflow-auto" style={{ maxHeight: 360 }}>
              {messages.length === 0 && (
                <div className="text-sm text-gray-500">Ask Propy about projects, suggestions or help.</div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`mb-3 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded ${m.sender === 'user' ? 'bg-blue-50 text-gray-900' : m.sender === 'bot' ? 'bg-gray-100 text-gray-900' : 'bg-yellow-50 text-gray-900'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t">
              <div className="flex space-x-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded"
                />
                <button
                  onClick={sendQuery}
                  disabled={loading}
                  className={`px-3 py-2 rounded bg-blue-600 text-white ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  {loading ? '...' : <FaPaperPlane />}
                </button>
              </div>
              <div className="text-xs text-gray-400 text-center mt-2">Powered by ProjectXplorer AI</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropyChatbot;
