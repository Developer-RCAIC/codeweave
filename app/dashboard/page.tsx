"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, AuthUser } from "../../lib/authService";
import { Project, projectService } from "../../lib/projectService";
import { Code2, Plus, Trash2, Eye, Calendar, LogOut, Search, Globe, Palette, Zap, User } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadProjects(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadProjects = async (userId: string) => {
    try {
      const userProjects = await projectService.getUserProjects(userId);
      setProjects(userProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push("/");
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleOpenProject = (project: Project) => {
    // Store project data in localStorage for the editor
    localStorage.setItem('currentProject', JSON.stringify(project));
    router.push('/editor');
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileTypeIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html': return <Globe size={14} className="text-orange-400" />;
      case 'css': return <Palette size={14} className="text-blue-400" />;
      case 'js': return <Zap size={14} className="text-yellow-400" />;
      default: return <Code2 size={14} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#11b981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-[#12141a]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#11b981] to-cyan-400 rounded-lg flex items-center justify-center">
                  <Code2 size={14} className="sm:size-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
                  <p className="text-xs sm:text-sm text-gray-400">{projects.length} projects</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <User size={14} className="sm:size-4" />
                <span className="truncate max-w-[200px]">{user?.displayName || user?.email}</span>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => router.push('/editor')}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#11b981] to-cyan-400 hover:from-[#0f9f6e] hover:to-cyan-500 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  <Plus size={16} className="sm:size-[18px]" />
                  <span className="hidden sm:inline">New Project</span>
                  <span className="sm:hidden">New</span>
                </button>
              
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                  title="Sign out"
                >
                  <LogOut size={16} className="sm:size-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-md">
            <Search size={18} className="sm:size-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-[#1a1d29]/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11b981]/50 focus:border-[#11b981]/50 transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-800/50 rounded-2xl flex items-center justify-center">
              <Code2 size={20} className="sm:size-6 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first project to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push('/editor')}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#11b981] to-cyan-400 hover:from-[#0f9f6e] hover:to-cyan-500 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                <Plus size={16} className="sm:size-[18px]" />
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className="group p-4 sm:p-6 bg-[#1a1d29]/30 border border-gray-700/50 rounded-2xl backdrop-blur-sm hover:bg-[#1a1d29]/50 hover:border-[#11b981]/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-[#11b981] transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 size={14} className="sm:size-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                  {project.files.slice(0, 3).map((file, index) => (
                    <div key={index} className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800/50 rounded text-xs">
                      {getFileTypeIcon(file.name)}
                      <span className="text-gray-300 truncate max-w-[60px] sm:max-w-none">{file.name}</span>
                    </div>
                  ))}
                  {project.files.length > 3 && (
                    <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800/50 rounded text-xs text-gray-400">
                      +{project.files.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} className="sm:size-3" />
                    <span className="text-[10px] sm:text-xs">{project.updatedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#11b981] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={10} className="sm:size-3" />
                    <span className="text-[10px] sm:text-xs">Open</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
