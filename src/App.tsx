import { Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar";
import LandingPage from "./Pages/LandingPage";
import FileUploader from "./component/FileUploader";
import TacticalContentGenerator from "./component/content";

import  { useState } from "react";

const App = () => {
  const [inputText, setInputText] = useState<string>("");

  return (
    <>
      <Navbar />
      <div>
        {/* Display the inputText value */}
        <p>Input Text: {inputText}</p>
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/file-uploader" element={<FileUploader setInputText={setInputText} />} />
        <Route path="/content-generator" element={<TacticalContentGenerator inputText={inputText} />} />

        {/* Add more routes as needed */}
      </Routes>
    </>
  );
};

export default App;

