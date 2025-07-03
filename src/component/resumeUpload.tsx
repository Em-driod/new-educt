import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

interface ResumeUploadProps {
  onResumeParsed: (text: string, fileName: string) => void;
}

export default function ResumeUpload({ onResumeParsed }: ResumeUploadProps) {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const mockParseFile = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result?.toString() || "");
      };
      reader.readAsText(file);
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError("🚫 Unsupported file type. Please upload PDF, DOCX, or TXT.");
      setFileName("");
      return;
    }

    setError("");
    setFileName(file.name);

    const parsedText = await mockParseFile(file);
    onResumeParsed(parsedText, file.name);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFileUpload({ target: { files: [file] } } as any);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-black border border-gray-700 rounded-2xl shadow-lg transition-all hover:scale-105 duration-300">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Upload Your Resume</h2>

      {/* Upload Box */}
      <label
        htmlFor="resume"
        className={`flex flex-col items-center justify-center h-48 border-4 border-dashed rounded-3xl cursor-pointer transition-colors duration-300 ${
          isDragging ? "border-red-500 bg-gray-900" : "border-gray-600 bg-gray-950"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUploadCloud className="text-4xl mb-2 text-red-500" />
        <p className="text-gray-300 mb-1 text-sm">
          <strong className="text-white">Click to upload</strong> or drag and drop
        </p>
        <p className="text-gray-500 text-xs">PDF, DOCX, or TXT</p>
        <input
          type="file"
          id="resume"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {/* Selected File Name */}
      {fileName && (
        <p className="mt-4 text-center text-red-500 font-semibold">
          📄 {fileName}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-center text-red-600 font-semibold animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}