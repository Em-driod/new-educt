import axios from 'axios';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiLoader,
  FiBookOpen,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiZap,
  FiCpu,
  FiLayers,
  FiFileText,
} from 'react-icons/fi';

interface FileUploaderProps {
  setInputText: (text: string) => void;
}

interface SectionItem {
  section: string;
  explanation: string;
}

interface InsightData {
  keyConcepts: SectionItem[];
  readingGuide: string[];
  relatedBooks: { title: string; author: string }[];
  contextualExplanation: SectionItem[];
  importantSections: SectionItem[];
}

interface AnalysisData {
  summary: SectionItem[];
  keyPoints: SectionItem[];
  actionItems: SectionItem[];
  followUpQuestions: SectionItem[];
  technicalTerms: { term: string; definition: string }[];
}

const AnimatedSection = ({
  title,
  content,
  contentList,
  sectionList,
  color,
  delay = 0,
  icon
}: {
  title: string;
  content?: string;
  contentList?: string[];
  sectionList?: SectionItem[];
  color: 'lime' | 'white';
  delay?: number;
  icon: React.ReactNode;
}) => {
  const colors = {
    lime: {
      bg: 'rgba(168, 255, 0, 0.08)',
      border: 'rgba(168, 255, 0, 0.2)',
      text: 'text-lime-300',
      iconBg: 'bg-black bg-opacity-40',
    },
    white: {
      bg: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: 'text-white',
      iconBg: 'bg-lime-800 bg-opacity-40',
    }
  };

  const selectedColors = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={`p-6 rounded-xl border border-opacity-30 backdrop-blur-sm shadow-lg
        transform hover:scale-[1.01] transition-transform duration-200 ease-out`}
      style={{
        backgroundColor: selectedColors.bg,
        borderColor: selectedColors.border,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${selectedColors.text} ${selectedColors.iconBg}`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold tracking-wide ${selectedColors.text}`}>{title}</h3>
      </div>

      {content && (
        <p className="text-gray-200 text-opacity-90 leading-relaxed text-base">
          {content}
        </p>
      )}

      {contentList && (
        <ul className="space-y-3">
          {contentList.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + idx * 0.1, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <FiChevronRight className={`mt-1 flex-shrink-0 ${selectedColors.text}`} />
              <span className="text-gray-200 text-opacity-90 text-base">{item}</span>
            </motion.li>
          ))}
        </ul>
      )}

      {sectionList && (
        <ul className="space-y-4">
          {sectionList.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + idx * 0.1, duration: 0.3 }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-start gap-3">
                <FiChevronRight className={`mt-1 flex-shrink-0 ${selectedColors.text}`} />
                <span className="text-gray-200 font-medium text-base">{item.section}</span>
              </div>
              <p className="text-gray-400 text-opacity-90 text-sm pl-6">
                {item.explanation}
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default function FileUploader({ setInputText }: FileUploaderProps) {
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'analysis'>('insights');
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = loadingInsights || loadingAnalysis;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError(null);
    setInsightData(null);
    setAnalysisData(null);

    const acceptedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!acceptedTypes.includes(selectedFile.type)) {
      setError("Unsupported file type. Please upload a PDF or DOCX file.");
      setFile(null);
      setFileName('');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const commonRequestConfig = (endpoint: string, setter: any, loaderSetter: any, tab: 'insights' | 'analysis') => async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    loaderSetter(true);
    setter(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`http://localhost:5000/api/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setter(res.data);
      setActiveTab(tab);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || `Failed to ${endpoint}. Please try again.`);
      } else {
        setError(`An unexpected error occurred during ${endpoint}.`);
      }
    } finally {
      loaderSetter(false);
    }
  };

  const handleInsights = commonRequestConfig('insights', setInsightData, setLoadingInsights, 'insights');
  const handleAnalyze = commonRequestConfig('analyze', setAnalysisData, setLoadingAnalysis, 'analysis');

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex items-center justify-center font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>

      <div className="w-full max-w-7xl z-10 relative">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500 tracking-tightest leading-none"
          >
            AetherMind AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Revolutionizing document intelligence with **unfettered cognitive insights** and predictive analysis.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-black rounded-3xl overflow-hidden border border-lime-900 shadow-3xl
            transform hover:shadow-lime-500/30 transition-shadow duration-300 relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-green-600 opacity-5 blur-xl"></div>
            <div className="relative z-10 p-7 border-b border-lime-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-lime-600 rounded-xl shadow-lg border border-lime-700">
                  <FiCpu className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Document Intelligence Suite</h2>
              </div>
              <div className="hidden md:flex items-center gap-3 text-sm text-gray-500">
                <span className="h-3 w-3 rounded-full bg-lime-400 animate-pulse-slow"></span>
                <span>AI Core Online</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <motion.div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              animate={{
                borderColor: isDragging ? 'rgba(168, 255, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: isDragging ? 'rgba(168, 255, 0, 0.03)' : 'rgba(255, 255, 255, 0.01)'
              }}
              className="border-2 border-dashed rounded-2xl p-10 mb-10 text-center transition-all duration-300 relative
                overflow-hidden group"
            >
              <div className="max-w-xl mx-auto relative z-10">
                <div className="inline-flex items-center justify-center p-5 bg-gray-900 rounded-full mb-5 shadow-inner border border-gray-700">
                  <FiUpload className="text-lime-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">
                  {file ? 'Document Ingested' : isDragging ? 'Release Data Stream' : 'Deploy Your Document'}
                </h3>
                <p className="text-gray-400 mb-6 text-lg font-light">
                  {file
                    ? `File: ${fileName} - Encrypted & Ready for Processing.`
                    : 'Drag and drop your PDF or DOCX data packet here, or initiate manual upload.'}
                </p>

                <motion.label
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="inline-block px-8 py-4 bg-lime-600 hover:bg-lime-700 rounded-xl font-bold text-white uppercase tracking-wider cursor-pointer transition-colors shadow-lg
                    relative overflow-hidden
                    before:content-[''] before:absolute before:inset-0 before:bg-white before:opacity-0 before:scale-x-0 before:transition-all before:duration-300 before:ease-out before:hover:opacity-[0.05] before:hover:scale-x-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {file ? 'Reconfigure Document' : 'Initiate Upload'}
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </motion.label>

                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-lime-400 flex items-center justify-center gap-3 text-lg font-medium"
                  >
                    <FiCheckCircle className="text-green-400" />
                    <span>File selected: **{fileName}**</span>
                  </motion.div>
                )}
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300
                bg-gradient-to-br from-lime-500 to-black animate-pulse-fast-fade"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.button
                onClick={handleInsights}
                disabled={!file || isLoading}
                whileHover={!file || isLoading ? {} : { scale: 1.03, boxShadow: '0 8px 30px rgba(168, 255, 0, 0.4)' }}
                whileTap={!file || isLoading ? {} : { scale: 0.97 }}
                className={`flex items-center justify-center gap-3 p-5 rounded-xl font-bold text-lg transition-all duration-200 relative overflow-hidden group
                  ${!file || isLoading ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
                    'bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white shadow-xl shadow-lime-500/10'}`}
              >
                {loadingInsights ? (
                  <>
                    <FiLoader className="animate-spin text-xl" />
                    Processing Cognitive Insights...
                  </>
                ) : (
                  <>
                    <FiLayers className="text-xl" />
                    Extract Cognitive Insights
                  </>
                )}
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300"></span>
                <span className="absolute inset-0 bg-lime-400 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 blur-sm"></span>
              </motion.button>

              <motion.button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                whileHover={!file || isLoading ? {} : { scale: 1.03, boxShadow: '0 8px 30px rgba(255, 255, 255, 0.4)' }}
                whileTap={!file || isLoading ? {} : { scale: 0.97 }}
                className={`flex items-center justify-center gap-3 p-5 rounded-xl font-bold text-lg transition-all duration-200 relative overflow-hidden group
                  ${!file || isLoading ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
                    'bg-gradient-to-r from-white to-gray-200 text-black shadow-xl shadow-white/10 hover:from-gray-100 hover:to-gray-300'}`}
              >
                {loadingAnalysis ? (
                  <>
                    <FiLoader className="animate-spin text-xl" />
                    Performing Neural Analysis...
                  </>
                ) : (
                  <>
                    <FiZap className="text-xl" />
                    Perform Neural Analysis
                  </>
                )}
                <span className="absolute inset-0 bg-lime-400 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300"></span>
                <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 blur-sm"></span>
              </motion.button>
            </div>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="p-5 bg-gray-950 rounded-xl border border-lime-500/50 flex items-center gap-5 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-lime-800 to-black opacity-10 animate-pulse-slow"></div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-lime-500 rounded-full opacity-20 animate-pulse-fast"></div>
                      <FiLoader className="relative text-lime-400 animate-spin text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lime-300 text-lg">
                        {loadingAnalysis ? 'Neural Analysis in Progress...' : 'Cognitive Processing Underway...'}
                      </h4>
                      <p className="text-sm text-gray-400 font-light">
                        Our advanced AI is {loadingAnalysis ? 'performing deep semantic analysis' : 'extracting key insights'} from your data. Please await results.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 bg-red-900/30 rounded-xl border border-red-500/30 flex items-start gap-4 mb-8 shadow-md"
                >
                  <FiXCircle className="text-red-400 mt-1 flex-shrink-0 text-xl" />
                  <div>
                    <h4 className="font-medium text-red-300 text-lg">Processing Anomaly Detected</h4>
                    <p className="text-sm text-red-200 font-light">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {(insightData || analysisData) && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-8"
                >
                  <div className="flex border-b border-gray-800 mb-8">
                    <button
                      onClick={() => setActiveTab('insights')}
                      disabled={!insightData}
                      className={`px-8 py-4 font-bold text-lg flex items-center gap-3 border-b-4 transition-colors duration-200
                        ${activeTab === 'insights' ?
                          'border-lime-500 text-lime-400' :
                          'border-transparent text-gray-400 hover:text-white hover:border-gray-700'}`}
                    >
                      <FiLayers className="text-xl" />
                      Cognitive Insights
                    </button>
                    <button
                      onClick={() => setActiveTab('analysis')}
                      disabled={!analysisData}
                      className={`px-8 py-4 font-bold text-lg flex items-center gap-3 border-b-4 transition-colors duration-200
                        ${activeTab === 'analysis' ?
                          'border-white text-white' :
                          'border-transparent text-gray-400 hover:text-white hover:border-gray-700'}`}
                    >
                      <FiZap className="text-xl" />
                      Neural Analysis
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {activeTab === 'insights' && insightData && (
                      <>
                        <AnimatedSection
                          title="Contextual Understanding"
                          sectionList={insightData.contextualExplanation}
                          color="lime"
                          icon={<FiBookOpen />}
                        />
                        <AnimatedSection
                          title="Key Concepts Identified"
                          sectionList={insightData.keyConcepts}
                          color="lime"
                          delay={0.1}
                          icon={<FiLayers />}
                        />
                        <AnimatedSection
                          title="Strategic Reading Guide"
                          contentList={insightData.readingGuide}
                          color="lime"
                          delay={0.2}
                          icon={<FiFileText />}
                        />
                        <AnimatedSection
                          title="Important Sections"
                          sectionList={insightData.importantSections}
                          color="lime"
                          delay={0.3}
                          icon={<FiBookOpen />}
                        />
                        <AnimatedSection
                          title="Recommended Resources"
                          contentList={insightData.relatedBooks.map(b => `${b.title} by ${b.author}`)}
                          color="lime"
                          delay={0.4}
                          icon={<FiBookOpen />}
                        />
                      </>
                    )}

                    {activeTab === 'analysis' && analysisData && (
                      <>
                        <AnimatedSection
                          title="Executive Summary"
                          sectionList={analysisData.summary}
                          color="white"
                          icon={<FiZap />}
                        />
                        <AnimatedSection
                          title="Critical Analysis Points"
                          sectionList={analysisData.keyPoints}
                          color="white"
                          delay={0.1}
                          icon={<FiZap />}
                        />
                        <AnimatedSection
                          title="Actionable Recommendations"
                          sectionList={analysisData.actionItems}
                          color="white"
                          delay={0.2}
                          icon={<FiZap />}
                        />
                        <AnimatedSection
                          title="Follow-Up Questions"
                          sectionList={analysisData.followUpQuestions}
                          color="white"
                          delay={0.3}
                          icon={<FiZap />}
                        />
                        <AnimatedSection
                          title="Technical Terminology"
                          contentList={analysisData.technicalTerms.map(t => `**${t.term}**: ${t.definition}`)}
                          color="white"
                          delay={0.4}
                          icon={<FiCpu />}
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center text-gray-600 text-sm md:text-base font-light tracking-wide"
        >
          <p>AetherMind AI v2.1 • © 2025 Neural Document Processor. All rights reserved.</p>
          <p className="mt-2">Secure AI Processing • Zero Data Retention Protocol • Military-Grade Encryption Protocols Engaged</p>
        </motion.div>
      </div>
    </div>
  );
}