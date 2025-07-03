// File: src/components/ProfessionalSpeechInput.tsx
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, RotateCw, Languages, User, AlertTriangle, Zap, Star, Headphones, MessageSquareText, Binary } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Extend the Window interface for SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Speaker = 'Speaker A' | 'Speaker B' | 'Participant 1' | 'Participant 2'; // Changed names for better UX
type Language = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP';
type Sentiment = 'positive' | 'negative' | 'neutral' | 'mixed' | '';

interface TranscriptEntry {
  speaker: Speaker;
  text: string;
  timestamp: Date;
  sentiment: Sentiment;
  keywords: string[];
}

interface SpeechInputProps {
  onTranscriptUpdate: (transcript: TranscriptEntry[]) => void;
  onAnalysisComplete?: (analysis: {
    sentiment: Sentiment;
    summary: string;
    keywords: string[];
  }) => void;
  speakers?: Speaker[];
  defaultLanguage?: Language;
}

const ProfessionalSpeechInput = ({
  onTranscriptUpdate,
  onAnalysisComplete,
  speakers = ['Speaker A', 'Speaker B'], // Updated default speaker names
  defaultLanguage = 'en-US',
}: SpeechInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>(speakers[0]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [overallSentiment, setOverallSentiment] = useState<Sentiment>(''); // Renamed to avoid confusion
  const [overallSummary, setOverallSummary] = useState(''); // Renamed
  const [overallKeywords, setOverallKeywords] = useState<string[]>([]); // Renamed
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Supported languages with proper display names
  const supportedLanguages: { code: Language; name: string }[] = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'ja-JP', name: 'Japanese' },
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Please use Chrome or Edge for optimal performance.');
      return;
    }

    const SpeechRecognition: typeof window.SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition);
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event: any) => {
      const results = event.results;
      const latestResult = results[results.length - 1];
      
      if (latestResult.isFinal) {
        const text = latestResult[0].transcript;
        if (text.trim()) {
          processNewTranscript(text);
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}. Please check microphone permissions.`);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]); // Re-initialize if language changes

  const processNewTranscript = async (text: string) => {
    const newEntry: TranscriptEntry = {
      speaker: currentSpeaker,
      text,
      timestamp: new Date(),
      sentiment: '', // Will be filled by analysis
      keywords: [],  // Will be filled by analysis
    };

    // In a real app, these would be actual API calls to your backend AI
    const analyzedEntry = await analyzeTranscript(newEntry);
    
    setTranscript(prev => {
      const updated = [...prev, analyzedEntry];
      onTranscriptUpdate(updated);
      return updated;
    });
  };

  // Re-run analysis when transcript changes
  useEffect(() => {
      updateOverallAnalysis();
  }, [transcript]);

  const analyzeTranscript = async (entry: TranscriptEntry): Promise<TranscriptEntry> => {
    // Simulate API calls for analysis
    const sentimentAnalysis = await analyzeSentiment(entry.text);
    const keywordExtraction = await extractKeywords(entry.text);
    
    return {
      ...entry,
      sentiment: sentimentAnalysis,
      keywords: keywordExtraction,
    };
  };

  const analyzeSentiment = async (text: string): Promise<Sentiment> => {
    // Simulate sentiment analysis API
    return new Promise(resolve => {
      setTimeout(() => {
        const positiveWords = ['excellent', 'happy', 'great', 'perfect', 'love', 'agree', 'good'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'disagree', 'issue'];
        
        const positiveCount = positiveWords.filter(w => text.toLowerCase().includes(w)).length;
        const negativeCount = negativeWords.filter(w => text.toLowerCase().includes(w)).length;
        
        if (positiveCount > 0 && negativeCount > 0) {
          resolve('mixed');
        } else if (positiveCount > negativeCount) { // Prioritize positive if more positive words
          resolve('positive');
        } else if (negativeCount > positiveCount) { // Prioritize negative if more negative words
          resolve('negative');
        } else {
          resolve('neutral');
        }
      }, 300); // Slight delay to simulate API call
    });
  };

  const extractKeywords = async (text: string): Promise<string[]> => {
    // Simulate keyword extraction API
    return new Promise(resolve => {
      setTimeout(() => {
        const commonKeywords = ['urgent', 'important', 'deadline', 'meeting', 'review', 'project', 'report', 'client', 'strategy', 'data'];
        const found = commonKeywords.filter(k => text.toLowerCase().includes(k));
        resolve(found.slice(0, 3)); // Return max 3 keywords
      }, 400); // Slight delay to simulate API call
    });
  };

  const updateOverallAnalysis = () => {
    if (transcript.length === 0) {
      setOverallSummary('');
      setOverallSentiment('');
      setOverallKeywords([]);
      if (onAnalysisComplete) {
        onAnalysisComplete({ sentiment: '', summary: '', keywords: [] });
      }
      return;
    }

    // Generate summary from last few entries (more robust summary needed for real app)
    const recentText = transcript.slice(-5).map(t => t.text).join(' ');
    const summaryGen = `Summary: ${recentText.length > 150 ? recentText.substring(0, 150) + '...' : recentText || 'No clear summary yet.'}`;
    setOverallSummary(summaryGen);

    // Calculate overall sentiment
    const sentiments = transcript.map(t => t.sentiment).filter(Boolean); // Filter out empty strings
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const mixedCount = sentiments.filter(s => s === 'mixed').length;

    let currentOverallSentiment: Sentiment = 'neutral';
    if (positiveCount > negativeCount && positiveCount > mixedCount) {
        currentOverallSentiment = 'positive';
    } else if (negativeCount > positiveCount && negativeCount > mixedCount) {
        currentOverallSentiment = 'negative';
    } else if (mixedCount > 0) {
        currentOverallSentiment = 'mixed';
    } else if (positiveCount > 0) { // If only positive, but not dominant over negative/mixed
        currentOverallSentiment = 'positive';
    } else if (negativeCount > 0) { // If only negative
        currentOverallSentiment = 'negative';
    }
    setOverallSentiment(currentOverallSentiment);

    // Extract all unique keywords
    const allKeywords = Array.from(new Set(transcript.flatMap(t => t.keywords)));
    setOverallKeywords(allKeywords);

    // Notify parent component
    if (onAnalysisComplete) {
      onAnalysisComplete({
        sentiment: currentOverallSentiment,
        summary: summaryGen,
        keywords: allKeywords,
      });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError(null);
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        setError('Failed to start speech recognition. Please ensure microphone access is granted and no other application is using it.');
        setIsListening(false);
      }
    }
  };

  const rotateSpeaker = () => {
    const currentIndex = speakers.indexOf(currentSpeaker);
    const nextIndex = (currentIndex + 1) % speakers.length;
    setCurrentSpeaker(speakers[nextIndex]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSentimentStyling = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-lime-600 text-lime-50 font-bold';
      case 'negative': return 'bg-red-600 text-red-50 font-bold';
      case 'mixed': return 'bg-yellow-600 text-yellow-50 font-bold';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getOverallSentimentColorClass = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-lime-400';
      case 'negative': return 'text-red-400';
      case 'mixed': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  }
  
  const getOverallSentimentIndicatorClass = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-lime-500';
      case 'negative': return 'bg-red-500';
      case 'mixed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white font-sans p-4 md:p-8 flex items-center justify-center overflow-hidden">
      {/* Background Grids and Glyphs */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>
      <div className="absolute inset-0 z-0 bg-radial-gradient"></div> {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-lime-500 rounded-full blur-[100px] opacity-[0.03] animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 h-72 w-72 bg-blue-500 rounded-full blur-[120px] opacity-[0.02] animate-pulse-slow delay-500"></div>

      <motion.div
        className="w-full max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 transform translate-y-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column: Controls & Status */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Header Card */}
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-lime-500 opacity-[0.03] blur-3xl rounded-2xl animate-pulse-flicker"></div>
            <h2 className="text-3xl font-extrabold text-lime-400 mb-2 flex items-center gap-3 relative z-10">
              <Headphones className="h-8 w-8" /> Neural Speech Interface
            </h2>
            <p className="text-gray-400 text-md font-light relative z-10">
              Real-time linguistic data acquisition & processing.
            </p>
          </motion.div>

          {/* Core Controls Panel */}
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 shadow-2xl flex flex-col items-center justify-center gap-6 relative"
            variants={itemVariants}
          >
            {/* Microphone Button */}
            <motion.button
              onClick={toggleListening}
              className={`relative flex items-center justify-center w-28 h-28 rounded-full transition-all duration-300 shadow-lg
                          ${isListening ? 'bg-red-700 hover:bg-red-800' : 'bg-lime-700 hover:bg-lime-800'}
                          ${isListening ? 'animate-pulse-mic' : ''} border-2 
                          ${isListening ? 'border-red-500' : 'border-lime-500'}`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <MicOff className="h-12 w-12 text-white" />
              ) : (
                <Mic className="h-12 w-12 text-white" />
              )}
              {isListening && (
                  <div className="absolute inset-0 rounded-full bg-red-500 opacity-50 animate-ping-slow"></div>
              )}
            </motion.button>
            <span className={`text-lg font-semibold ${isListening ? 'text-lime-300' : 'text-gray-300'} transition-colors duration-300`}>
              {isListening ? 'ACTIVATED: Listening for Input...' : 'STANDBY: Ready to Initiate Capture'}
            </span>

            {/* Speaker & Language Selection */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Speaker selection */}
              <div className="flex-1 flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 focus-within:border-lime-500 transition-colors">
                <User className="h-5 w-5 text-gray-400" />
                <select
                  value={currentSpeaker}
                  onChange={(e) => setCurrentSpeaker(e.target.value as Speaker)}
                  className="bg-transparent flex-grow text-white font-medium focus:outline-none cursor-pointer appearance-none"
                >
                  {speakers.map((speaker) => (
                    <option key={speaker} value={speaker} className="bg-gray-800 text-white">
                      {speaker}
                    </option>
                  ))}
                </select>
                <button
                  onClick={rotateSpeaker}
                  className="text-gray-400 hover:text-lime-400 transition-colors"
                  title="Rotate speaker profile"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>

              {/* Language selection */}
              <div className="flex-1 flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 focus-within:border-blue-500 transition-colors">
                <Languages className="h-5 w-5 text-gray-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent flex-grow text-white font-medium focus:outline-none cursor-pointer appearance-none"
                  disabled={isListening}
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 flex items-center gap-3 text-sm bg-red-900/40 text-red-300 p-4 rounded-lg border border-red-700 w-full"
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Middle Column: Live Data Stream (Transcript) */}
        <motion.div 
          className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl border border-gray-800 flex flex-col relative overflow-hidden"
          variants={containerVariants}
        >
            <div className="absolute inset-0 bg-blue-500 opacity-[0.02] blur-3xl rounded-2xl animate-pulse-flicker delay-300"></div>
            <div className="p-6 border-b border-gray-800 flex items-center gap-3 relative z-10">
                <MessageSquareText className="h-7 w-7 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Live Transcript Stream</h3>
                <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${isListening ? 'bg-lime-600 text-white animate-pulse-slow' : 'bg-gray-700 text-gray-400'}`}>
                    {isListening ? 'LIVE FEED' : 'DORMANT'}
                </span>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative z-10">
                {transcript.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Binary className="h-16 w-16 mx-auto mb-4 text-gray-700" />
                        <p className="text-xl font-light">Awaiting data input...</p>
                        <p className="text-sm mt-2">Initiate capture to begin real-time transcription.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <AnimatePresence initial={false}>
                        {transcript.map((entry, index) => (
                            <motion.div
                                key={index} // Consider a unique ID if elements can be reordered
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`p-4 rounded-xl shadow-md border 
                                    ${entry.speaker === speakers[0]
                                        ? 'bg-gray-800 border-l-4 border-lime-600 text-white'
                                        : 'bg-gray-850 border-l-4 border-blue-600 text-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`font-extrabold text-lg ${entry.speaker === speakers[0] ? 'text-lime-400' : 'text-blue-400'}`}>
                                            {entry.speaker}
                                        </span>
                                        {entry.sentiment && (
                                            <span
                                                className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider ${getSentimentStyling(entry.sentiment)}`}
                                            >
                                                {entry.sentiment}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">
                                        {formatTime(entry.timestamp)}
                                    </span>
                                </div>
                                <p className="mt-1 text-base leading-relaxed text-gray-200">{entry.text}</p>
                                {entry.keywords.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {entry.keywords.map((keyword, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 bg-gray-700 text-gray-200 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-600"
                                            >
                                                <Zap className="h-3 w-3 text-blue-300" />
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>

        {/* Right Column: Analysis Matrix */}
        <div className="lg:col-span-3"> {/* Analysis panel spans full width on large screens */}
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute inset-0 bg-purple-500 opacity-[0.02] blur-3xl rounded-2xl animate-pulse-flicker delay-600"></div>
            <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-2xl relative z-10">
              <Star className="h-7 w-7 text-purple-400" />
              Comprehensive Linguistic Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Sentiment card */}
              <motion.div 
                className="bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-inner-lg flex flex-col justify-between"
                variants={itemVariants}
              >
                <h4 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">Overall Sentiment Matrix</h4>
                {overallSentiment ? (
                  <div className="flex items-center gap-4 text-white">
                    <div
                      className={`h-6 w-6 rounded-full flex-shrink-0 ${getOverallSentimentIndicatorClass(overallSentiment)}`}
                    />
                    <span className={`capitalize font-extrabold text-2xl ${getOverallSentimentColorClass(overallSentiment)}`}>
                      {overallSentiment}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No analysis data yet.</p>
                )}
              </motion.div>

              {/* Keywords card */}
              <motion.div 
                className="bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-inner-lg"
                variants={itemVariants}
              >
                <h4 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">Extracted Key Topics</h4>
                {overallKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {overallKeywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-purple-900 text-purple-300 text-xs px-3.5 py-1.5 rounded-full font-medium border border-purple-700 transition-all hover:scale-105"
                      >
                        <Zap className="h-3 w-3" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No keywords detected yet.</p>
                )}
              </motion.div>

              {/* Summary card */}
              <motion.div 
                className="bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-inner-lg"
                variants={itemVariants}
              >
                <h4 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">AI-Generated Synopsis</h4>
                {overallSummary ? (
                  <p className="text-gray-200 text-sm leading-relaxed">{overallSummary}</p>
                ) : (
                  <p className="text-gray-400 text-sm">No comprehensive summary available.</p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Futuristic Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-600 font-mono tracking-wider z-10">
        <p>AETHERNET AI CORE V3.0 | SECURE BIOMETRIC LINGUISTIC PROCESSING</p>
        <p className="mt-1">© 2025 QUANTUM-SYNTHESIS SOLUTIONS. ALL RIGHTS RESERVED.</p>
      </div>

      {/* Global Styles for Custom Scrollbar and Animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b3b3b;
          border-radius: 10px;
          border: 2px solid #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Radial Gradient for background */
        .bg-radial-gradient {
          background: radial-gradient(circle at 50% 50%, rgba(168, 255, 0, 0.01) 0%, rgba(0, 0, 0, 0.8) 70%, rgba(0, 0, 0, 1) 100%);
        }

        /* Pulse flicker animation */
        @keyframes pulse-flicker {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        .animate-pulse-flicker {
          animation: pulse-flicker 4s infinite ease-in-out;
        }

        /* Mic pulse animation */
        @keyframes pulse-mic {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
        }
        .animate-pulse-mic {
            animation: pulse-mic 1.5s infinite cubic-bezier(0.66, 0, 0.33, 1);
        }

        /* General slow pulse */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite ease-in-out;
        }

        /* General ping-slow */
        @keyframes ping-slow {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0.2, 0.0, 0.8, 1.0) infinite;
        }

        /* Input/Select styling */
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 0.8em 0.8em;
          padding-right: 2.5rem; /* Space for the custom arrow */
        }
      `}</style>
    </div>
  );
};

export default ProfessionalSpeechInput;