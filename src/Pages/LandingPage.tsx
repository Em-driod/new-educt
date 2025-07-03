// File: src/App.jsx
import  { useState } from 'react';

import SpeechInput from '../component/SpeechInput';
import TextEditor from '../component/TextEditor';

import TacticalContentGenerator from '../component/content';

import AIHeroSection from '../component/heroSection';


import AIFlowchart from '../component/gloctar';

export default function LandingPage() {
 
  const [ ] = useState('');

  return (
    <div >
      
     
      <AIHeroSection />

     
      <SpeechInput onTranscriptUpdate={() => {}} />
      <TextEditor />
      <TacticalContentGenerator />
      
     / <AIFlowchart />
    </div>
  );
}

