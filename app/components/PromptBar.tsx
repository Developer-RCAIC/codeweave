"use client";

import { useState } from "react";
import { Loader2, History, Sparkles, Zap, Plus, Edit3 } from "lucide-react";

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  hasProject: boolean;
  onNewProject: () => void;
}

const EXAMPLE_PROMPTS = [
  "Build a modern landing page for a SaaS product with hero section, features, and pricing",
  "Create a portfolio website with smooth animations and dark mode toggle",
  "Design a dashboard interface with charts, tables, and responsive layout",
  "Build an interactive todo app with local storage and animations",
];

const EDIT_PROMPTS = [
  "Add a contact form to the existing website",
  "Change the color scheme to use blue and white",
  "Add smooth scroll animations between sections",
  "Make the layout more mobile-friendly",
  "Add a dark/light mode toggle",
  "Include social media links in the footer",
];

export default function PromptBar({ onGenerate, isLoading, hasProject, onNewProject }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const trimmedPrompt = prompt.trim();
    onGenerate(trimmedPrompt);
    
    // Add to history if not already present
    if (!history.includes(trimmedPrompt)) {
      setHistory(prev => [trimmedPrompt, ...prev].slice(0, 10)); // Keep last 10
    }
    
    setPrompt("");
    setShowExamples(false);
  };

  const applyPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setShowHistory(false);
    setShowExamples(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={hasProject 
                ? "Describe how you want to modify your project..." 
                : "Describe the website you want to create..."
              }
              className="w-full min-h-[100px] p-4 bg-[#1a1d29]/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#11b981]/50 focus:border-[#11b981]/50 backdrop-blur-sm transition-all duration-300 hover:bg-[#1a1d29]/70 text-sm"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit(e);
                }
              }}
              onFocus={() => setShowExamples(prompt.length === 0)}
              onBlur={() => setTimeout(() => setShowExamples(false), 150)}
            />
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-all duration-200"
                  title="Show prompt history"
                >
                  <History size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className={`${hasProject ? 'flex gap-2' : ''}`}>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`${hasProject ? 'flex-1' : 'w-full'} mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#11b981] to-cyan-400 hover:from-[#0f9f6e] hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 shadow-lg text-sm`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {hasProject ? 'Updating...' : 'Generating...'}
                </>
              ) : (
                <>
                  {hasProject ? <Edit3 size={16} /> : <Sparkles size={16} />}
                  {hasProject ? 'Update Project' : 'Generate Code'}
                </>
              )}
            </button>

            {hasProject && (
              <button
                type="button"
                onClick={onNewProject}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 text-sm"
                title="Start a new project"
              >
                <Plus size={16} />
                New
              </button>
            )}
          </div>

          {/* Examples Dropdown */}
          {showExamples && (
            <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-[#1a1d29]/95 border border-gray-700/50 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="p-3 border-b border-gray-700/50">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Zap size={12} className="text-[#11b981]" />
                  <span className="font-medium">
                    {hasProject ? 'Try these modifications' : 'Try these examples'}
                  </span>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {(hasProject ? EDIT_PROMPTS : EXAMPLE_PROMPTS).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => applyPrompt(example)}
                    className="w-full text-left p-3 text-xs text-gray-300 hover:bg-gray-700/30 border-b border-gray-700/30 last:border-b-0 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History Dropdown */}
          {showHistory && history.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-[#1a1d29]/95 border border-gray-700/50 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="p-3 border-b border-gray-700/50">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <History size={12} className="text-[#11b981]" />
                  <span className="font-medium">Recent Prompts</span>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => applyPrompt(item)}
                    className="w-full text-left p-3 text-xs text-gray-300 hover:bg-gray-700/30 border-b border-gray-700/30 last:border-b-0 transition-colors"
                  >
                    {item.length > 60 ? `${item.substring(0, 60)}...` : item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">⌘</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">↵</kbd>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-[#11b981] rounded-full animate-pulse"></div>
            <span>AI Ready</span>
          </div>
        </div>
      </form>
    </div>
  );
}
