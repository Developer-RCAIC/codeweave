"use client";

import { useEffect, useRef, useState } from "react";
import { FileTab } from "./Editor";
import { ExternalLink, RefreshCw, Eye, EyeOff, Monitor, Smartphone, Tablet } from "lucide-react";

interface LivePreviewProps {
  files: FileTab[];
  isVisible: boolean;
  onToggle: () => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export default function LivePreview({ files, isVisible, onToggle }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  const generatePreview = () => {
    if (files.length === 0) return;

    setIsRefreshing(true);

    // Find HTML file or create a basic one
    let htmlFile = files.find(file => file.name.endsWith('.html') || file.name.endsWith('.htm'));
    
    if (!htmlFile) {
      // Create a basic HTML template if none exists
      const cssFiles = files.filter(file => file.name.endsWith('.css'));
      const jsFiles = files.filter(file => file.name.endsWith('.js'));
      
      const cssLinks = cssFiles.map(file => `<link rel="stylesheet" href="${file.name}">`).join('\n    ');
      const jsLinks = jsFiles.map(file => `<script src="${file.name}"></script>`).join('\n    ');
      
      htmlFile = {
        id: 'auto-generated-html',
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    ${cssLinks}
</head>
<body>
    <div id="app">
        <h1>Generated Code Preview</h1>
        <p>Your generated code is running here!</p>
    </div>
    ${jsLinks}
</body>
</html>`,
        language: 'html'
      };
    }

    // Create a blob URL for the HTML content with inline CSS and JS
    let htmlContent = htmlFile.content;

    // Ensure proper viewport meta tag for responsive design
    if (!htmlContent.includes('viewport')) {
      htmlContent = htmlContent.replace(
        '<head>',
        '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
      );
    }

    // Inject CSS files as <style> tags
    const cssFiles = files.filter(file => file.name.endsWith('.css'));
    const cssContent = cssFiles.map(file => `<style>\n${file.content}\n</style>`).join('\n');
    
    // Inject JS files as <script> tags
    const jsFiles = files.filter(file => file.name.endsWith('.js'));
    const jsContent = jsFiles.map(file => `<script>\n${file.content}\n</script>`).join('\n');

    // Insert CSS before closing </head> tag
    if (cssContent && htmlContent.includes('</head>')) {
      htmlContent = htmlContent.replace('</head>', `${cssContent}\n</head>`);
    }

    // Insert JS before closing </body> tag or at the end
    if (jsContent) {
      if (htmlContent.includes('</body>')) {
        htmlContent = htmlContent.replace('</body>', `${jsContent}\n</body>`);
      } else {
        htmlContent += `\n${jsContent}`;
      }
    }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    setPreviewUrl(url);
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    if (files.length > 0) {
      generatePreview();
    }
    // Cleanup function to revoke blob URLs
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [files]);

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const getViewportClasses = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] mx-auto';
      case 'tablet':
        return 'w-[768px] h-[1024px] mx-auto';
      default:
        return 'w-full h-full';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="h-full bg-[#1a1d29]/30 border-l border-gray-700/50 flex flex-col backdrop-blur-sm">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-[#12141a]/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-gray-200">Live Preview</span>
          </div>
          
          {/* Viewport Controls */}
          <div className="flex items-center gap-1 bg-gray-700/30 rounded-lg p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-2 rounded transition-all ${
                viewport === 'desktop' ? 'bg-[#11b981]/20 text-[#11b981]' : 'text-gray-400 hover:text-white'
              }`}
              title="Desktop view"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-2 rounded transition-all ${
                viewport === 'tablet' ? 'bg-[#11b981]/20 text-[#11b981]' : 'text-gray-400 hover:text-white'
              }`}
              title="Tablet view"
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-2 rounded transition-all ${
                viewport === 'mobile' ? 'bg-[#11b981]/20 text-[#11b981]' : 'text-gray-400 hover:text-white'
              }`}
              title="Mobile view"
            >
              <Smartphone size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={generatePreview}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            title="Refresh preview"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={openInNewTab}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
          
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            title="Hide preview"
          >
            <EyeOff size={16} />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white overflow-auto">
        {previewUrl ? (
          <div className={`h-full transition-all duration-300 ${
            viewport === 'desktop' ? '' : 'p-4 flex items-center justify-center'
          }`}>
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className={`border-0 transition-all duration-300 ${getViewportClasses()} ${
                viewport !== 'desktop' ? 'border border-gray-300 rounded-lg shadow-lg' : ''
              }`}
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Eye size={24} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">No preview available</p>
              <p className="text-sm text-gray-500">Generate HTML/CSS/JS code to see live preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
