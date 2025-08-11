"use client";

import { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { X, Download, Plus, Copy, Check, Eye, Code2, Globe, Palette, Zap, FileText } from "lucide-react";

export interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface CodeEditorProps {
  files: FileTab[];
  onFilesChange: (files: FileTab[]) => void;
  onDownloadAll: () => void;
  onTogglePreview?: () => void;
  showPreview?: boolean;
}

export default function CodeEditor({ files, onFilesChange, onDownloadAll, onTogglePreview, showPreview }: CodeEditorProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const monaco = useMonaco();

  useEffect(() => {
    if (files.length > 0 && !activeFileId) {
      setActiveFileId(files[0].id);
    }
  }, [files, activeFileId]);

  useEffect(() => {
    if (monaco) {
      // Set dark theme
      monaco.editor.setTheme("vs-dark");
    }
  }, [monaco]);

  const activeFile = files.find(file => file.id === activeFileId);

  const updateFileContent = (content: string) => {
    if (!activeFileId) return;
    
    const updatedFiles = files.map(file =>
      file.id === activeFileId ? { ...file, content } : file
    );
    onFilesChange(updatedFiles);
  };

  const closeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    onFilesChange(updatedFiles);
    
    if (activeFileId === fileId) {
      setActiveFileId(updatedFiles.length > 0 ? updatedFiles[0].id : null);
    }
  };

  const addNewFile = () => {
    const newFile: FileTab = {
      id: Date.now().toString(),
      name: `new-file-${files.length + 1}.js`,
      content: "// New file\n",
      language: "javascript"
    };
    
    const updatedFiles = [...files, newFile];
    onFilesChange(updatedFiles);
    setActiveFileId(newFile.id);
  };

  const copyFileContent = async (file: FileTab) => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopiedFileId(file.id);
      setTimeout(() => setCopiedFileId(null), 2000);
    } catch (err) {
      console.error("Failed to copy content:", err);
    }
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      md: 'markdown',
      yaml: 'yaml',
      yml: 'yaml',
      xml: 'xml',
      sql: 'sql',
      sh: 'shell',
      bash: 'shell',
    };
    return langMap[ext || ''] || 'plaintext';
  };

  if (files.length === 0) {
    return (
      <div className="h-full bg-[#1a1d29]/30 border border-gray-700/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <div className="text-center p-8">        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#11b981]/20 to-cyan-400/20 rounded-2xl flex items-center justify-center">
          <Code2 size={24} className="text-[#11b981]" />
        </div>
          <div className="text-gray-300 mb-2 font-medium">No files generated yet</div>
          <div className="text-sm text-gray-500">
            Generate HTML, CSS, or JavaScript code to see files here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1a1d29]/30 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col">
      {/* File Tabs */}
      <div className="flex items-center bg-[#12141a]/50 border-b border-gray-700/50 overflow-x-auto scrollbar-thin">
        <div className="flex min-w-0">
          {files.map((file) => {
            const isActive = activeFileId === file.id;
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            const getFileIcon = () => {
              switch (fileExtension) {
                case 'html': return <Globe size={14} />;
                case 'css': return <Palette size={14} />;
                case 'js': return <Zap size={14} />;
                default: return <FileText size={14} />;
              }
            };

            return (
              <div
                key={file.id}
                className={`flex items-center px-4 py-3 text-sm border-r border-gray-700/50 cursor-pointer group relative transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1a1d29] text-white border-b-2 border-[#11b981]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1d29]/50'
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <div className="mr-2 text-gray-400">{getFileIcon()}</div>
                <span className="font-medium whitespace-nowrap">{file.name}</span>
                
                <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyFileContent(file);
                    }}
                    className="p-1 hover:bg-gray-600/50 rounded transition-all mr-1"
                    title="Copy content"
                  >
                    {copiedFileId === file.id ? (
                      <Check size={12} className="text-green-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file.id);
                    }}
                    className="p-1 hover:bg-red-500/50 rounded transition-all"
                    title="Close file"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center ml-auto px-3 border-l border-gray-700/50">
          {/* Preview Toggle Button */}
          {onTogglePreview && (
            <button
              onClick={onTogglePreview}
              className={`p-2 rounded-lg transition-all duration-200 mr-2 ${
                showPreview 
                  ? 'text-[#11b981] bg-[#11b981]/20 shadow-lg shadow-[#11b981]/25' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              <Eye size={16} />
            </button>
          )}
          
          <button
            onClick={addNewFile}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 mr-2"
            title="Add new file"
          >
            <Plus size={16} />
          </button>
          
          {files.length > 0 && (
            <button
              onClick={onDownloadAll}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              title="Download all files as ZIP"
            >
              <Download size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {activeFile && (
          <Editor
            height="100%"
            language={getLanguageFromFileName(activeFile.name)}
            value={activeFile.content}
            onChange={(value) => updateFileContent(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace",
              lineHeight: 1.6,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 20, bottom: 20 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              renderLineHighlight: 'gutter',
              contextmenu: false,
              folding: true,
              lineNumbers: 'on',
              glyphMargin: false,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        )}
        
        {/* File Info Overlay */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#12141a]/80 border border-gray-700/50 rounded-lg backdrop-blur-sm">
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>{activeFile?.name}</span>
            <span>•</span>
            <span>{activeFile?.content.split('\n').length} lines</span>
          </div>
        </div>
      </div>
    </div>
  );
}
