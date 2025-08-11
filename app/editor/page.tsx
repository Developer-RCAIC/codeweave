"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PromptBar from "../components/PromptBar";
import CodeEditor, { FileTab } from "../components/Editor";
import LivePreview from "../components/LivePreview";
import ProjectSaveModal from "../components/ProjectSaveModal";
import { downloadFilesAsZip, parseGeneratedCode } from "../utils/zipUtils";
import { projectService, Project } from "../../lib/projectService";
import { authService, AuthUser } from "../../lib/authService";
import { Code2, Sparkles, Save, ArrowLeft } from "lucide-react";

export default function EditorPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [files, setFiles] = useState<FileTab[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // Check if there's a project to load from localStorage
        const savedProject = localStorage.getItem('currentProject');
        if (savedProject) {
          const project = JSON.parse(savedProject);
          setCurrentProject(project);
          setFiles(project.files);
          localStorage.removeItem('currentProject');
          
          // Auto-show preview if HTML files exist
          const hasHtmlFile = project.files.some((file: FileTab) => 
            file.name.endsWith('.html') || file.name.endsWith('.htm')
          );
          if (hasHtmlFile) {
            setShowPreview(true);
          }
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGenerate = async (prompt: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const requestPrompt = files.length > 0 ? 
        `You are modifying an existing website. Here are the current project files:

${files.map(f => `=== ${f.name.toUpperCase()} ===
\`\`\`${f.language || 'text'}
${f.content}
\`\`\``).join('\n\n')}

USER REQUEST: ${prompt}

Please modify the above code according to the user's request. You MUST provide all files (HTML, CSS, JS) in your response, even if only some files are being modified. Base your changes on the existing code structure and maintain consistency.` : 
        prompt;

      console.log('Sending request with prompt:', files.length > 0 ? 'MODIFICATION MODE' : 'CREATION MODE');
      console.log('Current files count:', files.length);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: requestPrompt,
          model: "gpt-4o",
          systemMessage: `You are an expert web developer and designer that creates modern, beautiful websites using HTML, CSS, and JavaScript only. 
          
          ${files.length > 0 ? 
            `IMPORTANT: You are modifying an existing project. The current code has been provided in the prompt.

            MODIFICATION RULES:
            - You MUST read and understand the existing code structure completely
            - Keep ALL existing functionality unless explicitly asked to remove it
            - Maintain the current design, layout, and styling unless asked to change them
            - Only modify the specific elements requested by the user
            - Always provide complete files in your response (HTML, CSS, JS)
            - Ensure all modifications integrate seamlessly with existing code
            - Test that your changes don't break existing functionality
            
            Your response must include all project files, not just the modified parts.` :
            'CREATION MODE: Create a new website from scratch based on the user\'s requirements.'
          }
          
          CRITICAL FILE STRUCTURE REQUIREMENTS:
          - ALWAYS create separate files for HTML, CSS, and JavaScript
          - NEVER put CSS or JavaScript inline in HTML files
          - ALWAYS use external file references (e.g., <link rel="stylesheet" href="styles.css"> and <script src="script.js"></script>)
          - Generate multiple separate code blocks, one for each file
          
          DESIGN REQUIREMENTS:
          - Create visually stunning, modern designs with clean aesthetics
          - Use contemporary design trends: gradients, glassmorphism, smooth animations, subtle shadows
          - Implement responsive layouts that work perfectly on mobile, tablet, and desktop
          - Use modern CSS features: CSS Grid, Flexbox, custom properties, transitions, transforms
          - Include hover effects, smooth animations, and micro-interactions
          - Use beautiful color schemes and typography (Google Fonts are acceptable)
          - Add proper spacing, visual hierarchy, and modern UI patterns
          - Use a neon green/cyan color scheme (primary: #11b981, accent: cyan-400)
          
          TECHNICAL REQUIREMENTS:
          - Generate ONLY plain HTML, CSS, and JavaScript files
          - NO React, Vue, Angular, or any other frameworks
          - NO JSX syntax or component-based code
          - Use modern vanilla JavaScript (ES6+) for interactivity
          - Include semantic HTML5 elements
          - Ensure accessibility best practices
          - Make it fast-loading and performant
          
          REQUIRED RESPONSE FORMAT:
          You MUST structure your response exactly like this:
          
          \`\`\`index.html
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Your Title</title>
              <link rel="stylesheet" href="styles.css">
          </head>
          <body>
              <!-- Your HTML content -->
              <script src="script.js"></script>
          </body>
          </html>
          \`\`\`
          
          \`\`\`styles.css
          /* Your complete CSS styles here */
          \`\`\`
          
          \`\`\`script.js
          // Your complete JavaScript functionality here
          \`\`\`
          
          Remember: Create separate, complete files that work together when downloaded and run locally.`
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate code: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Parse the generated content into files
      const generatedFiles = parseGeneratedCode(data.content);
      setFiles(generatedFiles);
      
      // Auto-show preview if HTML files are generated
      const hasHtmlFile = generatedFiles.some(file => 
        file.name.endsWith('.html') || file.name.endsWith('.htm')
      );
      if (hasHtmlFile && !showPreview) {
        setShowPreview(true);
      }

      // Auto-save if project exists, otherwise show save modal for new projects
      if (currentProject) {
        await autoSaveProject(generatedFiles);
      } else if (generatedFiles.length > 0) {
        setShowSaveModal(true);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error generating code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadFilesAsZip(files, "CodeWeave-project");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to download files";
      setError(errorMessage);
    }
  };

  const handleNewProject = () => {
    setFiles([]);
    setError(null);
    setShowPreview(false);
    setCurrentProject(null);
  };

  const autoSaveProject = async (projectFiles: FileTab[]) => {
    if (!currentProject || !user) return;
    
    try {
      await projectService.updateProject(currentProject.id, projectFiles);
      console.log('Project auto-saved successfully');
    } catch (error) {
      console.error('Failed to auto-save project:', error);
    }
  };

  const handleSaveProject = async (name: string, description: string) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const projectId = await projectService.saveProject(name, description, files, user.uid);
      const newProject: Project = {
        id: projectId,
        name,
        description,
        files,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCurrentProject(newProject);
      setShowSaveModal(false);
      console.log('Project saved successfully');
    } catch (error) {
      console.error('Failed to save project:', error);
      setError('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilesChange = async (newFiles: FileTab[]) => {
    setFiles(newFiles);
    
    // Auto-save if project exists and files have changed
    if (currentProject && newFiles.length > 0) {
      await autoSaveProject(newFiles);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a0b0f] text-white flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-[#12141a] border-r border-gray-800/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#11b981] to-cyan-400 rounded-lg flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CodeWeave
              </h1>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-[#11b981]/10 border border-[#11b981]/20 rounded-lg">
              <Sparkles size={14} className="text-[#11b981]" />
              <span className="text-sm text-[#11b981] font-medium">
                {currentProject ? currentProject.name : 'CodeWeave'}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-b border-gray-800/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all text-sm"
              >
                <ArrowLeft size={14} />
                Dashboard
              </button>
              {currentProject && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all text-sm"
                  title="Save as new project"
                >
                  <Save size={14} />
                  Save As
                </button>
              )}
            </div>
          </div>

          {/* Prompt Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-sm text-gray-400 mb-3">
              {files.length > 0 ? 'Modify your project' : 'Describe your website'}
            </div>
            <PromptBar 
              onGenerate={handleGenerate} 
              isLoading={isLoading} 
              hasProject={files.length > 0}
              onNewProject={handleNewProject}
            />
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800/50 text-xs text-gray-500">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-[#11b981] rounded-full animate-pulse"></div>
              <span>Powered by AI</span>
            </div>
            <div>Built with Next.js & Monaco Editor</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="h-14 border-b border-gray-800/50 bg-[#12141a]/50 backdrop-blur-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {files.length > 0 ? `${files.length} files generated` : 'Ready to generate'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {files.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all duration-200"
                >
                  Download ZIP
                </button>
              )}
              
              {files.some(f => f.name.endsWith('.html')) && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    showPreview 
                      ? 'bg-[#11b981]/20 text-[#11b981] border border-[#11b981]/30' 
                      : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              )}
            </div>
          </div>

          {/* Editor and Preview Container */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
              <div className="h-full p-6">
                <CodeEditor
                  files={files}
                  onFilesChange={handleFilesChange}
                  onDownloadAll={handleDownloadAll}
                  onTogglePreview={() => setShowPreview(!showPreview)}
                  showPreview={showPreview}
                />
              </div>
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="w-1/2 border-l border-gray-800/50">
                <LivePreview 
                  files={files}
                  isVisible={showPreview}
                  onToggle={() => setShowPreview(!showPreview)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Save Modal */}
      <ProjectSaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveProject}
        isLoading={isSaving}
      />
    </>
  );
}
