import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileTab } from '../components/Editor';

export const downloadFilesAsZip = async (files: FileTab[], projectName: string = 'CodeWeave-project') => {
  if (files.length === 0) {
    throw new Error('No files to download');
  }

  const zip = new JSZip();

  // Add each file to the ZIP
  files.forEach((file) => {
    zip.file(file.name, file.content);
  });

  try {
    // Generate the ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Trigger download
    saveAs(content, `${projectName}.zip`);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error('Failed to create ZIP file');
  }
};

export const parseGeneratedCode = (content: string): FileTab[] => {
  const files: FileTab[] = [];
  
  // Enhanced pattern to match code blocks with filenames
  const fileBlockPattern = /```(?:(\w+)\s+)?([^\n]*\.(html?|css|js|txt))\s*\n([\s\S]*?)```/gi;
  
  let match;
  let fileIndex = 0;
  
  while ((match = fileBlockPattern.exec(content)) !== null) {
    const [, language, filename, extension, fileContent] = match;
    
    files.push({
      id: `${Date.now()}-${fileIndex}`,
      name: filename.trim(),
      content: fileContent.trim(),
      language: language || getLanguageFromExtension(extension)
    });
    
    fileIndex++;
  }
  
  // If no files with explicit filenames were found, try to detect separate code blocks
  if (files.length === 0) {
    // Look for HTML blocks
    const htmlMatches = content.matchAll(/```html?\s*\n([\s\S]*?)```/gi);
    let htmlIndex = 0;
    for (const htmlMatch of htmlMatches) {
      files.push({
        id: `${Date.now()}-html-${htmlIndex}`,
        name: htmlIndex === 0 ? 'index.html' : `page${htmlIndex + 1}.html`,
        content: htmlMatch[1].trim(),
        language: 'html'
      });
      htmlIndex++;
    }
    
    // Look for CSS blocks
    const cssMatches = content.matchAll(/```css\s*\n([\s\S]*?)```/gi);
    let cssIndex = 0;
    for (const cssMatch of cssMatches) {
      files.push({
        id: `${Date.now()}-css-${cssIndex}`,
        name: cssIndex === 0 ? 'styles.css' : `styles${cssIndex + 1}.css`,
        content: cssMatch[1].trim(),
        language: 'css'
      });
      cssIndex++;
    }
    
    // Look for JavaScript blocks
    const jsMatches = content.matchAll(/```(?:javascript|js)\s*\n([\s\S]*?)```/gi);
    let jsIndex = 0;
    for (const jsMatch of jsMatches) {
      files.push({
        id: `${Date.now()}-js-${jsIndex}`,
        name: jsIndex === 0 ? 'script.js' : `script${jsIndex + 1}.js`,
        content: jsMatch[1].trim(),
        language: 'javascript'
      });
      jsIndex++;
    }
  }
  
  // If still no files found, look for any code blocks and try to determine type
  if (files.length === 0) {
    const codeBlockPattern = /```(\w+)?\s*\n([\s\S]*?)```/gi;
    let blockMatch;
    let blockIndex = 0;
    
    while ((blockMatch = codeBlockPattern.exec(content)) !== null) {
      const [, language, code] = blockMatch;
      const detectedLang = language || detectLanguage(code);
      
      let fileName = 'generated-code.txt';
      switch (detectedLang) {
        case 'html':
          fileName = blockIndex === 0 ? 'index.html' : `page${blockIndex + 1}.html`;
          break;
        case 'css':
          fileName = blockIndex === 0 ? 'styles.css' : `styles${blockIndex + 1}.css`;
          break;
        case 'javascript':
          fileName = blockIndex === 0 ? 'script.js' : `script${blockIndex + 1}.js`;
          break;
        default:
          fileName = `file${blockIndex + 1}.${getExtensionFromLanguage(detectedLang)}`;
      }
      
      files.push({
        id: `${Date.now()}-${blockIndex}`,
        name: fileName,
        content: code.trim(),
        language: detectedLang
      });
      
      blockIndex++;
    }
  }
  
  // Last resort: if still no files, create based on content detection
  if (files.length === 0) {
    const detectedLanguage = detectLanguage(content);
    let fileName = 'generated-code.txt';
    
    switch (detectedLanguage) {
      case 'html':
        fileName = 'index.html';
        break;
      case 'css':
        fileName = 'styles.css';
        break;
      case 'javascript':
        fileName = 'script.js';
        break;
      default:
        fileName = `generated-code.${getExtensionFromLanguage(detectedLanguage)}`;
    }
    
    files.push({
      id: Date.now().toString(),
      name: fileName,
      content: content.trim(),
      language: detectedLanguage
    });
  }
  
  return files;
};

const getLanguageFromExtension = (extension: string): string => {
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
    txt: 'plaintext'
  };
  return langMap[extension.toLowerCase()] || 'plaintext';
};

const getExtensionFromLanguage = (language: string): string => {
  const extMap: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    markdown: 'md',
    yaml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    shell: 'sh',
    plaintext: 'txt'
  };
  return extMap[language] || 'txt';
};

const detectLanguage = (content: string): string => {
  const trimmedContent = content.trim().toLowerCase();
  
  // Check for HTML patterns first
  if (trimmedContent.includes('<!doctype html') || 
      trimmedContent.includes('<html') || 
      trimmedContent.includes('<div') ||
      trimmedContent.includes('<body') ||
      trimmedContent.includes('<head')) {
    return 'html';
  }
  
  // Check for CSS patterns
  if ((trimmedContent.includes('{') && trimmedContent.includes('}')) &&
      (trimmedContent.includes('color:') || 
       trimmedContent.includes('margin:') || 
       trimmedContent.includes('padding:') ||
       trimmedContent.includes('display:') ||
       trimmedContent.includes('background:') ||
       trimmedContent.includes('font-'))) {
    return 'css';
  }
  
  // Check for JavaScript patterns
  if (trimmedContent.includes('function ') || 
      trimmedContent.includes('const ') || 
      trimmedContent.includes('let ') ||
      trimmedContent.includes('var ') ||
      trimmedContent.includes('document.') ||
      trimmedContent.includes('console.') ||
      trimmedContent.includes('=>') ||
      trimmedContent.includes('addEventListener')) {
    return 'javascript';
  }
  
  // Legacy framework checks (but we prefer vanilla)
  if (trimmedContent.includes('import react') || trimmedContent.includes('from react') || trimmedContent.includes('jsx')) {
    return 'html'; // Convert React to HTML preference
  }
  
  if (trimmedContent.includes('interface ') || trimmedContent.includes('type ') || trimmedContent.includes(': string') || trimmedContent.includes(': number')) {
    return 'javascript'; // Convert TypeScript to JavaScript preference
  }
  
  if (trimmedContent.includes('def ') || trimmedContent.includes('import ') || trimmedContent.includes('print(')) {
    return 'javascript'; // Prefer JavaScript over Python for web
  }
  
  if (trimmedContent.startsWith('{') && trimmedContent.includes('"')) {
    return 'json';
  }
  
  return 'html'; // Default to HTML for web development
};
