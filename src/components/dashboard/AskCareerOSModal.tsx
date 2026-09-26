import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Send, ArrowRight, MessageSquare } from 'lucide-react';
import { aiService } from '../../services/ai';
import type { AIChatResponse } from '../../services/ai';
import { useNavigate } from 'react-router-dom';

export interface AskCareerOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskCareerOSModal: React.FC<AskCareerOSModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { sender: 'user' | 'ai'; text: string; action?: AIChatResponse['suggestedAction'] }[]
  >([
    {
      sender: 'ai',
      text: 'Hello Rahul! I analyze your real skills and benchmark you against hiring requirements for Data Analyst roles. What would you like to know?',
    },
  ]);

  const quickQuestions = [
    'How do I improve my Power BI gap faster?',
    'What jobs am I closest to qualifying for?',
    'What should be my next roadmap step?',
  ];

  const handleAsk = async (textToAsk: string) => {
    const question = textToAsk.trim();
    if (!question || loading) return;

    setHistory((prev) => [...prev, { sender: 'user', text: question }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await aiService.askCareerOS(question);
      setHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.answer,
          action: response.suggestedAction,
        },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I ran into an issue connecting to the CareerOS engine. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ask CareerOS AI"
      description="Instant guidance grounded in your real skill benchmarks"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Chat message area */}
        <div className="space-y-3 min-h-[220px] max-h-[340px] overflow-y-auto pr-1">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#14213D] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-50 border border-[#E2E8F0] text-[#0F172A]'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                {msg.action && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleActionClick(msg.action!.route)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#14213D] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm text-[#475569] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs">Analyzing your profile...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="pt-2 border-t border-[#E2E8F0]">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
            Suggested questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAsk(q)}
                disabled={loading}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-[#475569] px-2.5 py-1 rounded-full transition-colors text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex items-center gap-2 pt-2"
        >
          <div className="relative flex-1">
            <MessageSquare className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your readiness, gaps, or career..."
              className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 text-sm text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!query.trim() || loading}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Ask
          </Button>
        </form>
      </div>
    </Modal>
  );
};
