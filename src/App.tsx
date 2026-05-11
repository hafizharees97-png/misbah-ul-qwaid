/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, BookOpen, Layers, BookCheck, Info, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeText } from './services/geminiService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await analyzeText(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result || 'معذرت، کوئی نتیجہ موصول نہیں ہوا۔',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: error instanceof Error ? error.message : 'نامعلوم غلطی پیش آگئی۔',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex flex-col font-urdu" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <BookOpen className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">الميزان صرف و نحو</h1>
              <p className="text-xs text- emerald-600 font-sans tracking-widest opacity-70">AL-MIZAN ANALYZER</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-800 opacity-60">
             <div className="flex flex-col items-end">
                <span className="text-sm font-bold">حنفی بریلوی ماتریدی</span>
                <span className="text-[10px] font-sans">TRADITIONAL PERSPECTIVE</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="text-emerald-500 w-10 h-10 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">خوش آمدید!</h2>
              <p className="text-lg text-gray-600 max-w-md leading-relaxed mb-8">
                عربی یا اردو کا کوئی بھی جملہ یا لفظ لکھیں تاکہ اس کی صرفی و نحوی تحقیق حنفی بریلوی ماتریدی عقائد کے عین مطابق کی جا سکے۔
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {[
                  { icon: Layers, label: 'صرفی تحقیق', desc: 'صیغہ، مادہ، باب کی پہچان' },
                  { icon: BookCheck, label: 'نحوی تحقیق', desc: 'جملے کی ترکیب اور اعراب' },
                  { icon: Info, label: 'علمی باریکیاں', desc: 'عقائد و ادب کا خاص خیال' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-100 group">
                    <item.icon className="w-6 h-6 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-gray-800 mb-1">{item.label}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col gap-4 py-4 min-h-[400px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-6 shadow-sm ${
                    msg.type === 'user' 
                    ? 'bg-emerald-600 text-white shadow-emerald-100' 
                    : 'bg-white border border-emerald-50 text-gray-800 shadow-gray-100'
                  }`}>
                    {msg.type === 'user' ? (
                      <p className="text-xl leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="markdown-container text-right">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end"
                >
                  <div className="bg-white border border-emerald-50 rounded-2xl p-6 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    <span className="text-sm text-gray-500 italic">تحقیق جاری ہے...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-top border-gray-100">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اپنا جملہ یہاں لکھیں..."
              rows={1}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none text-lg min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:bg-gray-300 disabled:shadow-none transition-all"
            >
              <Send className="w-5 h-5 -rotate-45" />
            </button>
          </form>
          <p className="text-[10px] text-center mt-3 text-gray-400 opacity-70">
            نوٹ: تمام جوابات مصنوعی ذہانت کے ذریعے تیار کیے جاتے ہیں، حتمی تصدیق کے لیے مستند کتب سے رجوع کریں۔
          </p>
        </div>
      </footer>

      {/* Floating Info (Optional) */}
      <div className="fixed bottom-24 left-6 hidden lg:block">
        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white shadow-sm max-w-xs transition-opacity hover:opacity-100 opacity-60">
          <div className="flex items-center gap-2 mb-2">
             <MessageSquare className="w-4 h-4 text-emerald-500" />
             <span className="text-xs font-bold text-emerald-900 leading-none">ہدایات</span>
          </div>
          <ul className="text-[10px] text-gray-600 space-y-1 pr-2">
            <li>• مشکل عربی صیغے بھیجیں۔</li>
            <li>• قرآنی آیات کی ترکیب پوچھیں۔</li>
            <li>• جملے کے اجزاء کی پہچان کریں۔</li>
          </ul>
        </div>
      </div>

      <style>{`
        .markdown-container {
          line-height: 1.8;
          font-size: 1.1rem;
        }
        .markdown-container h1, .markdown-container h2, .markdown-container h3 {
          color: #065f46;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .markdown-container h1 { font-size: 1.5rem; }
        .markdown-container h2 { font-size: 1.3rem; }
        .markdown-container h3 { font-size: 1.15rem; }
        .markdown-container p {
          margin-bottom: 1rem;
        }
        .markdown-container strong {
          color: #064e3b;
          font-weight: 700;
        }
        .markdown-container ul {
          list-style: disc;
          margin-right: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-container li {
          margin-bottom: 0.5rem;
        }
        .markdown-container blockquote {
          border-right: 4px solid #10b981;
          padding-right: 1rem;
          margin-bottom: 1rem;
          color: #4b5563;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

