import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Main TacticalContentGenerator component
const TacticalContentGenerator = () => {
  // FormData interface defines the structure of our form data
  interface FormData {
    contentType: string;
    topic: string;
    tactics: string[];
    tone: string;
    length: string;
    complexity: string;
    audience: string;
    keywords: string;
    examples: string;
    humorLevel: string;
  }

  // State to manage form inputs, initialized with default values
  const [formData, setFormData] = useState<FormData>({
    contentType: 'strategy',
    topic: '',
    tactics: [],
    tone: 'professional',
    length: 'medium',
    complexity: 'intermediate',
    audience: '',
    keywords: '',
    examples: 'yes',
    humorLevel: 'none',
  });

  // State variables for UI control and feedback
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step of the multi-step form
  const [loading, setLoading] = useState(false); // Indicates if content generation is in progress
  const [content, setContent] = useState(''); // Stores the generated content
  const [showAdvanced, setShowAdvanced] = useState(false); // Controls visibility of advanced options
  const [error, setError] = useState(''); // Stores any error messages

  // Ref for scrolling to the output section
  const outputRef = useRef<HTMLDivElement>(null);

  // Define the steps of the form for progress indicator and navigation
  const steps = [
    { name: 'Core', label: 'Core Query' },
    { name: 'Frameworks', label: 'Frameworks' },
    { name: 'Parameters', label: 'Parameters' },
    { name: 'Generate', label: 'Generate' },
  ];

  // Tactical options with human-readable labels
  const tacticalOptions = [
    { value: 'swot', label: 'Strength/Weakness Review' },
    { value: 'pestle', label: 'External Factors Scan' },
    { value: 'porter', label: "Competitive Landscape Scan" },
    { value: 'okr', label: 'Goal Setting with Metrics' },
    { value: 'growth', label: 'Rapid Experimentation' },
    { value: 'military', label: 'Strategic Maneuvering' },
    { value: 'game', label: 'Interactive Decision-Making' },
    { value: 'behavioral', label: 'Human Behavior Insights' },
  ];

  // Type definition for input change events
  interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {}

  // Handler for basic input changes (text, select)
  const handleChange = (e: HandleChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user interacts with inputs
  };

  // Handler for selecting/deselecting tactical approaches (multi-select)
  const handleTacticSelect = (value: string) => {
    setFormData((prev: FormData) => {
      const newTactics = prev.tactics.includes(value)
        ? prev.tactics.filter((t: string) => t !== value) // Remove if already selected
        : [...prev.tactics, value]; // Add if not selected
      return { ...prev, tactics: newTactics };
    });
    if (error) setError(''); // Clear error when user makes changes
  };

  /**
   * Helper function to check if the current step's required fields are valid.
   * This function ONLY returns a boolean and does NOT modify state (e.g., setError).
   * It's used for dynamic styling of the "Next Step" button.
   */
  const isCurrentStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Core Step: Requires 'topic' to be filled
        return !!formData.topic.trim(); // Returns true if topic is not empty
      case 1: // Frameworks Step: Requires at least one 'tactic' to be selected
        return formData.tactics.length > 0; // Returns true if at least one tactic is selected
      case 2: // Parameters Step: All fields are optional, always valid to proceed
      case 3: // Generate Step: No specific client-side validation for this step's inputs
        return true;
      default:
        return true; // Should not happen in normal flow
    }
  };

  /**
   * Validates the current step's required fields and sets an error message if invalid.
   * This function MODIFIES state (setError) and is called on explicit user actions (e.g., clicking Next).
   */
  const validateStep = (stepIndex: number): boolean => {
    setError(''); // Clear any previous errors before validation

    switch (stepIndex) {
      case 0: // Core Step: Requires 'topic' to be filled
        if (!formData.topic.trim()) {
          setError('Please provide a "Core Query" (topic) to proceed.');
          return false;
        }
        break;
      case 1: // Frameworks Step: Requires at least one 'tactic' to be selected
        if (formData.tactics.length === 0) {
          setError('Please select at least one "Operational Framework" to proceed.');
          return false;
        }
        break;
      case 2: // Parameters Step: All fields are optional, so it's always valid to proceed
        break;
      case 3: // Generate Step: No specific validation before attempting generation, handled by generateContent
        break;
      default:
        return true; // Should not happen
    }
    return true; // Validation passed for the current step
  };

  // Function to move to the next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) { // Validate current step before advancing
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setError(''); // Clear errors upon successful step transition
      }
    }
  };

  // Function to move to the previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError(''); // Clear errors when going back
    }
  };

  // Function to generate content by calling the local backend endpoint
  const generateContent = async () => {
    // Basic validation before initiating the API call (primarily for step 3)
    // Most validation happens on handleNextStep
    if (!formData.topic.trim() || formData.tactics.length === 0) {
        setError('Please complete all previous required fields.');
        return;
    }

    setLoading(true); // Activate loading state
    setError(''); // Clear any previous errors
    setContent(''); // Clear any previous generated content

    try {
      // The local backend endpoint that will handle the AI generation
      const apiUrl = 'https://educt-back.onrender.com/api/generate-content';

      // The payload sent to your backend will contain all form data
      const payload = {
        contentType: formData.contentType,
        topic: formData.topic,
        tactics: formData.tactics,
        tone: formData.tone,
        length: formData.length,
        complexity: formData.complexity,
        audience: formData.audience,
        keywords: formData.keywords,
        examples: formData.examples,
        humorLevel: formData.humorLevel,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Assuming your backend response has a 'content' field
      if (!data.content) {
        throw new Error('No content received from backend server');
      }

      setContent(data.content);

      // Scroll to the generated content section after it has rendered
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300); // Small delay to ensure content is visible before scrolling
    } catch (err) {
      console.error('Error generating content:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to generate content. Please check your network and try again.');
      } else {
        setError('An unexpected error occurred during content generation.');
      }
    } finally {
      setLoading(false); // Deactivate loading state regardless of success or failure
    }
  };

  // Function to download the generated content as a Markdown file
  const downloadMarkdown = () => {
    if (!content) return; // Ensure there is content to download

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Create a dynamic filename from the topic or a default
    a.download = `tactical-content-${formData.topic.replace(/\s+/g, '-').toLowerCase() || 'untitled'}.md`;
    document.body.appendChild(a); // Temporarily append to the DOM
    a.click(); // Programmatically click the anchor to trigger download
    document.body.removeChild(a); // Clean up the temporary anchor
    URL.revokeObjectURL(url); // Release the object URL
  };

  // Function to copy the generated content to the clipboard
  const copyToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!content) return; // Ensure there is content to copy

    const button = e.currentTarget;
    const originalText = button.textContent; // Store original text for feedback animation

    try {
      await navigator.clipboard.writeText(content); // Use modern Clipboard API
      button.textContent = 'Copied!'; // Provide visual feedback to the user
      setTimeout(() => {
        if (button) {
          button.textContent = originalText; // Revert button text after a delay
        }
      }, 2000);
    } catch (err) {
      console.error('Failed to copy using Clipboard API:', err);
      // Fallback method for older browsers or environments with restricted Clipboard API access
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed'; // Position off-screen
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select(); // Select the text within the textarea
      try {
        document.execCommand('copy'); // Execute copy command
        button.textContent = 'Copied (Fallback)!';
      } catch (fallbackErr) {
        console.error('Failed to copy with fallback:', fallbackErr);
        button.textContent = 'Copy Failed!'; // Indicate failure
      } finally {
        setTimeout(() => {
          if (button) {
            button.textContent = originalText; // Revert button text
          }
        }, 2000);
        document.body.removeChild(textArea); // Clean up the temporary textarea
      }
    }
  };

  // Function to reset the entire form and state to initial values
  const clearForm = () => {
    setFormData({
      contentType: 'strategy',
      topic: '',
      tactics: [],
      tone: 'professional',
      length: 'medium',
      complexity: 'intermediate',
      audience: '',
      keywords: '',
      examples: 'yes',
      humorLevel: 'none',
    });
    setContent(''); // Clear generated content
    setError(''); // Clear any error messages
    setCurrentStep(0); // Reset to the first step of the form
    setShowAdvanced(false); // Hide advanced options
  };

  // Function to regenerate content by adding an unused tactical approach
  const regenerateWithEnhancement = () => {
    if (formData.tactics.length > 0) {
      const allTactics = tacticalOptions.map(opt => opt.value);
      const unusedTactics = allTactics.filter(t => !formData.tactics.includes(t));
      if (unusedTactics.length > 0) {
        // Randomly select one unused tactic to add
        const randomTactic = unusedTactics[Math.floor(Math.random() * unusedTactics.length)];
        setFormData(prev => ({ ...prev, tactics: [...prev.tactics, randomTactic] }));
      }
    }
    // A small delay ensures the state update is processed before re-generating content
    setTimeout(() => {
      generateContent();
    }, 100);
  };

  // Framer Motion variants for section entry animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  // Button animation variants
  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: '0 0 15px rgba(191, 255, 0, 0.7), 0 0 25px rgba(191, 255, 0, 0.4)',
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98, transition: { duration: 0.1, ease: "easeIn" } },
  };

  const primaryButtonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: '0 0 20px rgba(191, 255, 0, 0.9), 0 0 35px rgba(191, 255, 0, 0.6)',
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98, transition: { duration: 0.1, ease: "easeIn" } },
  };

  // Variants for the tactical option buttons (select/unselect animation)
  const tacticButtonVariants = {
    initial: { scale: 1, backgroundColor: '#1a1a1a', color: '#b0b0b0', borderColor: '#333', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' },
    selected: {
      scale: 1.03,
      backgroundColor: '#BFFF00', // Limon Green
      color: '#0a0a0a', // Dark text for contrast
      boxShadow: '0 0 12px rgba(191, 255, 0, 0.8), 0 0 20px rgba(191, 255, 0, 0.5)',
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
    unselected: {
      scale: 1,
      backgroundColor: '#1a1a1a',
      color: '#b0b0b0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
    hover: { scale: 1.01, boxShadow: '0 2px 8px rgba(0,0,0,0.5)', backgroundColor: '#2a2a2a' },
    tap: { scale: 0.99 },
  };

  // Style for applying a text gradient effect
  const textGradientStyle = {
    background: 'linear-gradient(45deg, #BFFF00, #E0FF4F)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    // Main application container with dark theme and responsive padding
    <div className="min-h-screen w-screen bg-black text-gray-100 font-sans p-4 sm:p-8 lg:p-12 overflow-hidden relative">
      {/* Background grid pattern for visual aesthetics */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>

      {/* Main content wrapper, centered and with increased max-width */}
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header section with title and subtitle */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-lg"
            style={textGradientStyle}
          >
            Aethermind Content Matrix
          </motion.h1>
          <motion.p className="text-gray-400 text-lg sm:text-xl lg:text-2xl font-light">
            Synthesizing strategies from raw data. Optimize. Generate. Evolve.
          </motion.p>
        </motion.div>

        {/* Main Form Container */}
        <motion.div
          className="bg-gray-900 bg-opacity-70 backdrop-blur-md border border-lime-700 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl-lime transform hover:shadow-3xl-lime transition-all duration-300 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated dashed border for techy feel */}
          <div className="absolute inset-0 border-4 border-dashed border-lime-900 opacity-20 rounded-3xl animate-pulse-slow pointer-events-none"></div>

          <div className="relative z-10">
            {/* Progress Indicator */}
            <div className="flex justify-between items-center mb-10">
              {steps.map((step, index) => (
                <div key={step.name} className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                      ${index <= currentStep ? 'bg-lime-500 text-gray-900' : 'bg-gray-700 text-gray-400'}
                      ${index < currentStep && 'opacity-70'}
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {index < currentStep ? '✔' : index + 1} {/* Checkmark for completed steps */}
                  </motion.div>
                  <motion.p
                    className={`mt-2 text-xs sm:text-sm font-semibold text-center
                      ${index <= currentStep ? 'text-lime-400' : 'text-gray-400'}
                    `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    {step.label}
                  </motion.p>
                  {index < steps.length - 1 && (
                    <motion.div
                      className={`h-1 w-full absolute top-1/2 -translate-y-1/2 z-0
                        ${index < currentStep ? 'bg-lime-500' : 'bg-gray-700'}
                      `}
                      style={{ left: `calc(${index * (100 / (steps.length - 1))}%)`, width: `${100 / (steps.length - 1)}%`}}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentStep ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      transformTemplate={({ scaleX }) => `scaleX(${scaleX}) translateX(-50%)`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Conditional rendering for each step */}
            <AnimatePresence mode='wait'> {/* 'wait' mode ensures one component exits before the next enters */}
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold text-lime-500 mb-6 font-mono border-b border-lime-700 pb-3">STEP 1: Core Query</h3>
                  {/* Content Type */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="contentType" className="block text-sm font-semibold text-lime-400 mb-2">
                      Content Protocol
                    </label>
                    <select
                      name="contentType"
                      id="contentType"
                      value={formData.contentType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base transition-all duration-200"
                    >
                      <option value="strategy">Strategic Algorithm</option>
                      <option value="tactical">Tactical Data Analysis</option>
                      <option value="marketing">Marketing Directive</option>
                      <option value="technical">Technical Schematics</option>
                      <option value="persuasive">Persuasion Matrix</option>
                      <option value="custom">Custom Protocol</option>
                    </select>
                  </motion.div>

                  {/* Topic */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="topic" className="block text-sm font-semibold text-gray-300 mb-2">
                      Core Query <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="topic"
                      id="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="E.g., 'Optimizing Quantum Computing Efficiency'"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base placeholder-gray-600 transition-all duration-200"
                      required
                    />
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold text-lime-500 mb-6 font-mono border-b border-lime-700 pb-3">STEP 2: Operational Frameworks</h3>
                  {/* Tactical Approaches */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Operational Frameworks <span className="text-red-500">*</span> (Select one or more)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {tacticalOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => handleTacticSelect(option.value)}
                          variants={tacticButtonVariants}
                          initial="initial"
                          animate={formData.tactics.includes(option.value) ? 'selected' : 'unselected'}
                          whileHover="hover"
                          whileTap="tap"
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out border`}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                    {formData.tactics.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-lime-500 mt-3 font-medium"
                      >
                        Active Frameworks: {formData.tactics.map(t => tacticalOptions.find(opt => opt.value === t)?.label).join(', ')}
                      </motion.p>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold text-lime-500 mb-6 font-mono border-b border-lime-700 pb-3">STEP 3: Auxiliary Parameters</h3>
                  {/* Tone, Length, and Humor Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="tone" className="block text-sm font-semibold text-gray-300 mb-2">Cognition Tone</label>
                      <select
                        name="tone"
                        id="tone"
                        value={formData.tone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base transition-all duration-200"
                      >
                        <option value="professional">Formal</option>
                        <option value="academic">Analytical</option>
                        <option value="authoritative">Directive</option>
                        <option value="persuasive">Persuasive</option>
                        <option value="urgent">Critical</option>
                        <option value="analytical">Diagnostic</option>
                        <option value="conversational">Engaging</option>
                        <option value="friendly">Empathetic</option>
                      </select>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="length" className="block text-sm font-semibold text-gray-300 mb-2">Output Vector Length</label>
                      <select
                        name="length"
                        id="length"
                        value={formData.length}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base transition-all duration-200"
                      >
                        <option value="short">Short (Micro-Burst)</option>
                        <option value="medium">Medium (Standard Packet)</option>
                        <option value="long">Long (Extended Sequence)</option>
                        <option value="extensive">Extensive (Deep Dive Matrix)</option>
                      </select>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="humorLevel" className="block text-sm font-semibold text-gray-300 mb-2">
                        Humor Sub-routine
                      </label>
                      <select
                        name="humorLevel"
                        id="humorLevel"
                        value={formData.humorLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base transition-all duration-200"
                      >
                        <option value="none">Deactivated</option>
                        <option value="slight">Minimal Anomaly</option>
                        <option value="moderate">Intermittent Glitch</option>
                        <option value="very">Full Spectrum Banter</option>
                      </select>
                    </motion.div>
                  </div>

                  {/* Advanced Options Toggle */}
                  <motion.div variants={itemVariants} className="border-t border-gray-700 pt-7">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center text-sm text-lime-500 hover:text-lime-400 focus:outline-none group font-medium"
                    >
                      <motion.span
                        animate={{ rotate: showAdvanced ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mr-2 transform text-lg font-bold"
                      >
                        {showAdvanced ? '▼' : '▶'}
                      </motion.span>
                      <span className="group-hover:underline">
                        {showAdvanced ? 'Conceal Auxiliary Parameters' : 'Access Auxiliary Parameters'}
                      </span>
                    </button>
                  </motion.div>

                  {/* Advanced Options Content */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="space-y-6 p-6 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div variants={itemVariants}>
                            <label htmlFor="complexity" className="block text-sm font-semibold text-gray-300 mb-2">
                              System Complexity
                            </label>
                            <select
                              name="complexity"
                              id="complexity"
                              value={formData.complexity}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base transition-all duration-200"
                            >
                              <option value="basic">Minimal</option>
                              <option value="intermediate">Standard</option>
                              <option value="advanced">Complex</option>
                              <option value="expert">Hyperspatial</option>
                            </select>
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label htmlFor="examples" className="block text-sm font-semibold text-gray-300 mb-2">
                              Include Data Examples
                            </label>
                            <select
                              name="examples"
                              id="examples"
                              value={formData.examples}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base transition-all duration-200"
                            >
                              <option value="yes">Affirmative</option>
                              <option value="no">Negative</option>
                              <option value="extensive">Extensive Data Stream</option>
                            </select>
                          </motion.div>
                        </div>

                        <motion.div variants={itemVariants}>
                          <label htmlFor="audience" className="block text-sm font-semibold text-gray-300 mb-2">
                            Target Audience Protocol
                          </label>
                          <input
                            type="text"
                            name="audience"
                            id="audience"
                            value={formData.audience}
                            onChange={handleChange}
                            placeholder="E.g., 'Synthetic Intelligences, Bio-Digital Interfaces, Cybernetic Analysts'"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base placeholder-gray-600 transition-all duration-200"
                          />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label htmlFor="keywords" className="block text-sm font-semibold text-gray-300 mb-2">
                            Key Terms Infusion (comma separated)
                          </label>
                          <input
                            type="text"
                            name="keywords"
                            id="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            placeholder="E.g., 'neural networks, quantum entanglement, algorithmic efficiency'"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-200 text-base placeholder-gray-600 transition-all duration-200"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold text-lime-500 mb-6 font-mono border-b border-lime-700 pb-3">STEP 4: Generate Content</h3>
                  <p className="text-gray-300 text-center text-lg mb-8">
                    All parameters configured. Ready to initiate content synthesis.
                  </p>
                  {/* Action Buttons specific to the generation step */}
                  <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-7 justify-center">
                    <motion.button
                      onClick={generateContent}
                      disabled={loading}
                      variants={primaryButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="px-8 py-3 bg-lime-500 text-gray-900 rounded-full hover:bg-lime-600 disabled:opacity-60 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center transform active:scale-95"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <motion.div
                            className="border-t-2 border-b-2 border-gray-900 h-5 w-5 rounded-full animate-spin-fast mr-3"
                          ></motion.div>
                          Processing Data...
                        </span>
                      ) : (
                        'INITIATE FORGE'
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Display (persists across steps) */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-4 mt-8 bg-red-900 border border-red-700 rounded-lg text-red-300 flex items-center justify-center gap-2 font-mono text-sm"
                >
                  <span className="text-xl leading-none">!</span> ERROR: {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons (Next/Previous) */}
            <motion.div variants={itemVariants} className="flex justify-between mt-12 pt-7 border-t border-gray-700">
              {currentStep > 0 && (
                <motion.button
                  onClick={handlePrevStep}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-6 py-3 bg-gray-700 text-gray-100 rounded-full hover:bg-gray-600 transition-all duration-300 font-semibold shadow-md transform active:scale-95"
                >
                  ← Previous Step
                </motion.button>
              )}
              {currentStep < steps.length - 1 && (
                <motion.button
                  onClick={handleNextStep}
                  variants={primaryButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  // Use the new isCurrentStepValid for conditional styling
                  className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 transform active:scale-95
                    ${isCurrentStepValid(currentStep) ? 'bg-lime-500 text-gray-900 hover:bg-lime-600' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}
                  `}
                >
                  Next Step →
                </motion.button>
              )}
              {currentStep === steps.length - 1 && (
                <motion.button
                  onClick={clearForm}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-6 py-3 bg-red-700 text-white rounded-full hover:bg-red-600 transition-all duration-300 font-semibold shadow-md transform active:scale-95"
                >
                  RESET SYSTEM
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Loading State Display (visible when generateContent is active) */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gray-900 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-2xl p-8 sm:p-10 mb-12 border border-lime-700 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-lime-900 opacity-5 animate-pulse-lightest pointer-events-none"></div>
              <div className="flex flex-col items-center justify-center relative z-10">
                <motion.div
                  className="h-16 w-16 border-4 border-lime-500 border-t-transparent rounded-full mb-4 animate-spin-slow"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                ></motion.div>
                <p className="text-lime-400 text-center text-lg mb-2 font-mono">
                  Synthesizing Tactical Data...
                </p>
                <p className="text-sm text-gray-400 font-mono">
                  Querying knowledge base with {formData.tactics.length} active framework{formData.tactics.length !== 1 ? 's' : ''}.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Content Display (visible only when content is available) */}
        <AnimatePresence>
          {content && (
            <motion.div
              ref={outputRef} // Used for scrolling into view
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gray-900 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-lime-700 relative"
            >
              {/* Output log header with action buttons */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center relative z-10">
                <h2 className="text-2xl font-bold text-lime-500 font-mono">OUTPUT LOG //</h2>
                <div className="flex gap-3">
                  <motion.button
                    onClick={copyToClipboard}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-sm px-4 py-2 bg-gray-700 text-gray-100 rounded-full hover:bg-gray-600 transition-colors duration-300 shadow-sm font-mono"
                  >
                    Copy
                  </motion.button>
                  <motion.button
                    onClick={downloadMarkdown}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-sm px-4 py-2 bg-lime-500 text-gray-900 rounded-full hover:bg-lime-600 transition-colors duration-300 shadow-sm font-mono"
                  >
                    Download
                  </motion.button>
                  <motion.button
                      onClick={regenerateWithEnhancement}
                      disabled={loading}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="text-sm px-4 py-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md transform active:scale-95"
                    >
                      Optimize & Regenerate
                    </motion.button>
                </div>
              </div>
              {/* Preformatted display for the generated content */}
              <div className="p-6 sm:p-8 relative z-10">
                <div className="prose max-w-none text-gray-100">
                  <pre className="whitespace-pre-wrap text-base text-gray-200 leading-relaxed font-mono bg-gray-950 p-6 rounded-lg border border-gray-800 overflow-x-auto shadow-inner custom-scrollbar">
                    {content}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tailwind Custom CSS (inline for this example to keep code self-contained) */}
      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .custom-text-shadow {
          text-shadow: 0 0 10px rgba(191, 255, 0, 0.7),
                       0 0 20px rgba(191, 255, 0, 0.5),
                       0 0 30px rgba(191, 255, 0, 0.3);
        }

        .shadow-2xl-lime {
          box-shadow: 0 25px 50px -12px rgba(191, 255, 0, 0.25);
        }

        .hover\\:shadow-3xl-lime:hover {
          box-shadow: 0 35px 60px -15px rgba(191, 255, 0, 0.4);
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        .animate-pulse-lightest {
          animation: pulse-lightest 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-lightest {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }

        .animate-spin-fast {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a2a2a;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #BFFF00;
          border-radius: 10px;
          border: 2px solid #2a2a2a;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E0FF4F;
        }
      `}</style>
    </div>
  );
};

export default TacticalContentGenerator;
