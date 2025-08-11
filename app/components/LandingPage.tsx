import { useState, useEffect } from 'react'
import { ArrowRight, Code2, Sparkles, GitBranch, Play, ChevronDown, Users, Coffee, Globe } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDashboard: () => void;
}

export default function LandingPage({ onGetStarted, onViewDashboard }: LandingPageProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Generate complete web projects from simple descriptions using state-of-the-art AI models.",
      code: `// Just describe what you want
"Create a modern portfolio website with dark theme"`
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Iterative Editing",
      description: "Continuously refine and enhance your projects without starting over. AI understands your existing code.",
      code: `// Keep improving your project
"Add a contact form with validation"
"Make it responsive for mobile"`
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Professional Code",
      description: "Get production-ready HTML, CSS, and JavaScript with modern best practices and clean architecture.",
      code: `// Always gets the structure right
index.html, styles.css, script.js
// Clean, semantic, accessible`
    }
  ]

  const stats = [
    { number: "100%", label: "Free Forever" },
    { number: "No Limits", label: "No Restrictions" },
    { number: "Royal", label: "College" },
    { number: "AI Club", label: "Developed" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/[0.06] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                CodeWeave
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={onViewDashboard}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={onGetStarted}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Start Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              100% Free AI Development Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent leading-tight">
              Weave Beautiful Code
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                with AI
              </span>
            </h1>

            <p className="text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              A completely free AI-powered coding platform developed by the Royal College 
              Artificial Intelligence Club. Transform your ideas into production-ready web 
              applications instantly with no cost, no limits, and no compromises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 flex items-center gap-2"
              >
                Start Coding for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="group px-8 py-4 border border-zinc-700 hover:border-zinc-600 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-zinc-800">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-zinc-500 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-zinc-500 animate-bounce">
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built by Royal College AI Club
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Every feature designed to democratize coding and make AI development accessible to everyone
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Display */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    currentFeature === index
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50'
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      currentFeature === index
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-800/50 text-zinc-500'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Code Preview */}
            <div className="relative">
              <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-sm text-zinc-500">CodeWeave AI</span>
                </div>
                <div className="p-6">
                  <div className="transition-all duration-300">
                    <pre className="text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {features[currentFeature].code}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-white/10 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-white/10 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative z-10 py-32 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See CodeWeave in Action
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Watch how easy it is to create beautiful websites with our free AI platform
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden group cursor-pointer">
              {!isVideoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-black hover:bg-emerald-400 transition-all duration-200 hover:scale-110"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                  <p className="text-zinc-500">Demo video would play here</p>
                </div>
              )}
              
              {/* Demo Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold mb-2">CodeWeave Demo</h3>
                  <p className="text-zinc-300 text-sm">Watch how to build a complete website in under 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Royal College AI Club Section */}
      <section id="about" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Developed by Royal College AI Club
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              CodeWeave is a passion project by the Royal College Artificial Intelligence Club, 
              committed to making AI-powered development accessible to everyone. No costs, no barriers, 
              just pure innovation in the spirit of educational excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Student Innovation</h3>
              <p className="text-zinc-400">
                Built by students, for students and developers worldwide. A testament to what passionate learners can achieve.
              </p>
            </div>

            <div className="text-center p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Completely Free</h3>
              <p className="text-zinc-400">
                Completely free forever. No hidden costs, no premium tiers. Education and innovation should be accessible to all.
              </p>
            </div>

            <div className="text-center p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Community Driven</h3>
              <p className="text-zinc-400">
                Fueled by late-night coding sessions and a shared vision to democratize AI development tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 border border-emerald-500/20 rounded-3xl p-12 md:p-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
              Ready to Code for Free?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join the Royal College AI Club community and start building amazing projects at no cost
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 flex items-center gap-2"
              >
                Start Building for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                CodeWeave
              </span>
            </div>
            <div className="flex items-center gap-6 text-zinc-500 text-sm">
              <span>© 2025 CodeWeave by Royal College AI Club. Always free.</span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsVideoPlaying(false)}
          />
          <div className="relative w-full max-w-4xl aspect-video bg-zinc-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ×
            </button>
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              Demo video would play here
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
