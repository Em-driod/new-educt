import { useState, useRef } from "react";
import jsPDF from 'jspdf';

import { Document, Paragraph, Packer, TextRun } from "docx";

interface OutputPanelProps {
  resumeText: string;
  jobDesc: string;
}

type ExperienceItem = {
  title: string;
  company: string;
  dates: string;
  details: string;
};

type EducationItem = {
  degree: string;
  institution: string;
  year: string;
};

type Qualifications = {
  education: EducationItem[];
  certifications: string[];
  skills: string[];
};

type AiOutput = {
  summary: string;
  resume: string[];
  coverLetter: string;
  linkedIn: string;
  experience: ExperienceItem[];
  qualifications: Qualifications;
};

export default function OutputPanel({ resumeText, jobDesc }: OutputPanelProps) {
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<AiOutput | null>(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [editedResume, setEditedResume] = useState<string[]>([]);
  const [editedCoverLetter, setEditedCoverLetter] = useState("");
  const [editedLinkedIn, setEditedLinkedIn] = useState("");
  const [editedExperience, setEditedExperience] = useState<ExperienceItem[]>([]);
  const [editedQualifications, setEditedQualifications] = useState<Qualifications>({
    education: [],
    certifications: [],
    skills: [],
  });

  const outputRef = useRef<HTMLDivElement>(null);

  async function fetchAiOutput() {
    if (!resumeText || !jobDesc) {
      setError("Please provide both resume and job description.");
      setAiOutput(null);
      return;
    }

    setLoading(true);
    setError("");
    setAiOutput(null);
    setIsEditing(false);

    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume: resumeText, jobDescription: jobDesc }),
      });

      if (!response.ok) {
        throw new Error(`Can't connect to server: ${response.statusText}`);
      }

      const data = (await response.json()) as AiOutput;
      if (!Array.isArray(data.resume)) data.resume = [];

      setAiOutput(data);
      setEditedSummary(data.summary);
      setEditedResume(data.resume);
      setEditedCoverLetter(data.coverLetter);
      setEditedLinkedIn(data.linkedIn);
      setEditedExperience(data.experience || []);
      setEditedQualifications(data.qualifications || {
        education: [],
        certifications: [],
        skills: [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate AI output.");
    } finally {
      setLoading(false);
    }
  }

  function updateResumePoint(index: number, value: string) {
    const updated = [...editedResume];
    updated[index] = value;
    setEditedResume(updated);
  }

  function addResumePoint() {
    setEditedResume([...editedResume, ""]);
  }

  function removeResumePoint(index: number) {
    const updated = editedResume.filter((_, i) => i !== index);
    setEditedResume(updated);
  }

  function updateExperienceField(
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) {
    const updated = [...editedExperience];
    updated[index] = { ...updated[index], [field]: value };
    setEditedExperience(updated);
  }

  function addExperienceItem() {
    setEditedExperience([
      ...editedExperience,
      { title: "", company: "", dates: "", details: "" },
    ]);
  }

  function removeExperienceItem(index: number) {
    const updated = editedExperience.filter((_, i) => i !== index);
    setEditedExperience(updated);
  }

  function updateEducationField(
    index: number,
    field: keyof EducationItem,
    value: string
  ) {
    const updated = [...editedQualifications.education];
    updated[index] = { ...updated[index], [field]: value };
    setEditedQualifications({
      ...editedQualifications,
      education: updated,
    });
  }

  function addEducationItem() {
    setEditedQualifications({
      ...editedQualifications,
      education: [...editedQualifications.education, { degree: "", institution: "", year: "" }],
    });
  }

  function removeEducationItem(index: number) {
    const updated = editedQualifications.education.filter((_, i) => i !== index);
    setEditedQualifications({
      ...editedQualifications,
      education: updated,
    });
  }

  function updateCertification(index: number, value: string) {
    const updated = [...editedQualifications.certifications];
    updated[index] = value;
    setEditedQualifications({
      ...editedQualifications,
      certifications: updated,
    });
  }

  function addCertification() {
    setEditedQualifications({
      ...editedQualifications,
      certifications: [...editedQualifications.certifications, ""],
    });
  }

  function removeCertification(index: number) {
    const updated = editedQualifications.certifications.filter((_, i) => i !== index);
    setEditedQualifications({
      ...editedQualifications,
      certifications: updated,
    });
  }

  function updateSkill(index: number, value: string) {
    const updated = [...editedQualifications.skills];
    updated[index] = value;
    setEditedQualifications({
      ...editedQualifications,
      skills: updated,
    });
  }

  function addSkill() {
    setEditedQualifications({
      ...editedQualifications,
      skills: [...editedQualifications.skills, ""],
    });
  }

  function removeSkill(index: number) {
    const updated = editedQualifications.skills.filter((_, i) => i !== index);
    setEditedQualifications({
      ...editedQualifications,
      skills: updated,
    });
  }

  async function toggleEdit() {
    if (isEditing) {
      // Save edits back to aiOutput state
      if (aiOutput) {
        const updatedOutput = {
          ...aiOutput,
          summary: editedSummary,
          resume: editedResume,
          coverLetter: editedCoverLetter,
          linkedIn: editedLinkedIn,
          experience: editedExperience,
          qualifications: editedQualifications,
        };
        setAiOutput(updatedOutput);
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }

// import jsPDF


const saveAsPDF = () => {
  if (!outputRef.current || !aiOutput) {
    console.error("Output reference or AI output is not available");
    return;
  }

  const doc = new jsPDF();
  const margin = 15;
  const pageHeight = doc.internal.pageSize.height;
  const usableWidth = doc.internal.pageSize.width - margin * 2;
  const lineHeight = 8;
  let y = margin;

  // Helper: move to next page if needed
  const checkPageSpace = (linesNeeded = 1) => {
    if (y + linesNeeded * lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Helper: wrap long text and write to PDF
  const writeWrappedText = (text: string, fontSize = 10, bold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, usableWidth);
    lines.forEach((line: string) => {
      checkPageSpace();
      doc.text(line, margin, y);
      y += lineHeight;
    });
  };

  // Helper: write section title and list of lines
  const writeLines = (title: string, lines: string[]) => {
    checkPageSpace();
    writeWrappedText(title, 13, true);
    y += 2;

    lines.forEach(line => {
      checkPageSpace();
      writeWrappedText(line);
    });

    y += lineHeight; // extra space after section
  };

  // Write each section
  writeLines("Summary", [aiOutput.summary]);

  writeLines("Resume Highlights", aiOutput.resume.map(item => `• ${item}`));

  writeLines("Cover Letter", aiOutput.coverLetter.split('\n').filter(Boolean));

  writeLines("LinkedIn Bio", aiOutput.linkedIn.split('\n').filter(Boolean));

  writeLines("Experience", aiOutput.experience.flatMap(exp => [
    `${exp.title} - ${exp.company}`,
    exp.dates,
    ...exp.details.split('\n').filter(Boolean),
    ''
  ]));

  writeLines("Education", aiOutput.qualifications.education.map(
    edu => `${edu.degree}, ${edu.institution} (${edu.year})`
  ));

  writeLines("Certifications", aiOutput.qualifications.certifications.map(cert => `• ${cert}`));

  writeLines("Skills", aiOutput.qualifications.skills.map(skill => `• ${skill}`));

  doc.save('resume_output.pdf');
};



  async function saveAsDOCX(outputData: AiOutput) {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Summary",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph(outputData.summary),
            new Paragraph({ text: "", heading: "Heading1" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Resume Highlights",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...outputData.resume.map(point => new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun(point)],
            })),
            new Paragraph({ text: "", heading: "Heading1" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Cover Letter",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph(outputData.coverLetter),
            new Paragraph({ text: "", heading: "Heading1" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "LinkedIn Bio",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph(outputData.linkedIn),
            new Paragraph({ text: "", heading: "Heading1" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Experience",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...outputData.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.title} - ${exp.company}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.dates,
                    italics: true,
                  }),
                ],
              }),
              new Paragraph(exp.details),
              new Paragraph({ text: "" }),
            ]),
            new Paragraph({ text: "", heading: "Heading1" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Qualifications",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Education",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            ...outputData.qualifications.education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.degree}, ${edu.institution} (${edu.year})`,
                  }),
                ],
              }),
            ]),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Certifications",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            ...outputData.qualifications.certifications.map(cert =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun(cert)],
              })
            ),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Skills",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            ...outputData.qualifications.skills.map(skill =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun(skill)],
              })
            ),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'job-application-materials.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating DOCX:', err);
      alert('Failed to generate DOCX. Please try again.');
    }
  }

  return (
    <div
      className="bg-black text-white max-w-4xl mx-auto rounded-xl shadow-md border border-white p-8 min-h-[32rem] overflow-y-auto font-sans"
      ref={outputRef}
    >
      <h2 className="text-2xl font-serif font-bold mb-6 border-b border-white pb-2">
        AI Output
      </h2>

      <button
        onClick={fetchAiOutput}
        disabled={loading || !resumeText || !jobDesc}
        className="mb-8 px-6 py-3 font-semibold rounded-md bg-white text-black transition-colors duration-300 hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate AI Output"}
      </button>

      {error && <p className="text-red-400 mb-6 font-medium">{error}</p>}

      {!loading && aiOutput && (
        <div className="space-y-10 text-base leading-relaxed">
          <section>
            <h1>Name</h1>
            <h3 className="font-serif font-semibold text-xl mb-2 border-b border-white pb-1">
              Summary
            </h3>
            {isEditing ? (
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md resize-y bg-gray-800 text-white"
                rows={4}
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
              />
            ) : (
              <p className="text-white">{aiOutput.summary}</p>
            )}
          </section>

          <section>
            <h3 className="font-serif font-semibold text-xl mb-3 border-b border-white pb-1">
              Resume Highlights
            </h3>
            {isEditing ? (
              <>
                {editedResume.length === 0 && <p className="text-white">No highlights available.</p>}
                <ol className="list-decimal list-inside space-y-2 text-white font-medium">
                  {editedResume.map((point, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <textarea
                        className="flex-grow p-1 border text-white border-red-300 rounded resize-y bg-gray-800"
                        rows={2}
                        value={point}
                        onChange={(e) => updateResumePoint(i, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeResumePoint(i)}
                        className="text-red-400 font-bold px-2 hover:text-red-300"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={addResumePoint}
                  className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-300"
                >
                  + Add Highlight
                </button>
              </>
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-white font-medium">
                {aiOutput.resume.length === 0 ? (
                  <li>No highlights available.</li>
                ) : (
                  aiOutput.resume.map((point, i) => <li key={i}>{point}</li>)
                )}
              </ol>
            )}
          </section>

          <section>
            <h3 className="font-serif font-semibold text-xl mb-3 border-b border-white pb-1">
              Cover Letter
            </h3>
            {isEditing ? (
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md resize-y bg-gray-800 text-white"
                rows={8}
                value={editedCoverLetter}
                onChange={(e) => setEditedCoverLetter(e.target.value)}
              />
            ) : (
              <pre className="whitespace-pre-wrap bg-gray-900 text-white p-4 rounded-md border border-white">
                {aiOutput.coverLetter}
              </pre>
            )}
          </section>

          <section>
            <h3 className="font-serif font-semibold text-xl mb-3 border-b border-white pb-1">
              LinkedIn Bio
            </h3>
            {isEditing ? (
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md resize-y bg-gray-800 text-white"
                rows={6}
                value={editedLinkedIn}
                onChange={(e) => setEditedLinkedIn(e.target.value)}
              />
            ) : (
              <pre className="whitespace-pre-wrap bg-gray-900 text-white p-4 rounded-md border border-white">
                {aiOutput.linkedIn}
              </pre>
            )}
          </section>

          <section>
            <h3 className="font-serif font-semibold text-xl mb-3 border-b border-white pb-1">
              Experience
            </h3>
            {isEditing ? (
              <>
                {editedExperience.length === 0 && (
                  <p className="text-white">No experience data provided.</p>
                )}
                <ul className="space-y-4">
                  {editedExperience.map((exp, i) => (
                    <li
                      key={i}
                      className="border border-gray-300 rounded p-3 relative bg-gray-800"
                    >
                      <button
                        type="button"
                        onClick={() => removeExperienceItem(i)}
                        className="absolute top-1 right-1 text-red-400 font-bold hover:text-red-300"
                        aria-label="Remove Experience"
                      >
                        &times;
                      </button>
                      <input
                        type="text"
                        placeholder="Title"
                        value={exp.title}
                        onChange={(e) =>
                          updateExperienceField(i, "title", e.target.value)
                        }
                        className="w-full p-1 mb-2 border border-gray-300 rounded bg-gray-700 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperienceField(i, "company", e.target.value)
                        }
                        className="w-full p-1 mb-2 border border-gray-300 rounded bg-gray-700 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Dates"
                        value={exp.dates}
                        onChange={(e) =>
                          updateExperienceField(i, "dates", e.target.value)
                        }
                        className="w-full p-1 mb-2 border border-gray-300 rounded bg-gray-700 text-white"
                      />
                      <textarea
                        placeholder="Details"
                        value={exp.details}
                        onChange={(e) =>
                          updateExperienceField(i, "details", e.target.value)
                        }
                        rows={3}
                        className="w-full p-1 border border-gray-300 rounded resize-y bg-gray-700 text-white"
                      />
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={addExperienceItem}
                  className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-300"
                >
                  + Add Experience
                </button>
              </>
            ) : (
              <ul className="space-y-6 text-white">
                {aiOutput.experience.length === 0 ? (
                  <li>No experience data provided.</li>
                ) : (
                  aiOutput.experience.map((exp, i) => (
                    <li key={i}>
                      <h4 className="font-semibold">
                        {exp.title} - {exp.company}
                      </h4>
                      <p className="italic text-sm">{exp.dates}</p>
                      <p>{exp.details}</p>
                    </li>
                  ))
                )}
              </ul>
            )}
          </section>

          <section>
            <h3 className="font-serif font-semibold text-xl mb-3 border-b border-white pb-1">
              Qualifications
            </h3>
            {isEditing ? (
              <>
                <div className="mb-4">
                  <h4 className="font-semibold mb-1 text-white">Education</h4>
                  {editedQualifications.education.length === 0 && (
                    <p className="text-white">No education data provided.</p>
                  )}
                  <ul className="space-y-3">
                    {editedQualifications.education.map((edu, i) => (
                      <li
                        key={i}
                        className="border border-gray-300 rounded p-3 relative bg-gray-800"
                      >
                        <button
                          type="button"
                          onClick={() => removeEducationItem(i)}
                          className="absolute top-1 right-1 text-red-400 font-bold hover:text-red-300"
                          aria-label="Remove Education"
                        >
                          &times;
                        </button>
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducationField(i, "degree", e.target.value)
                          }
                          className="w-full p-1 mb-1 border border-gray-300 rounded bg-gray-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducationField(i, "institution", e.target.value)
                          }
                          className="w-full p-1 mb-1 border border-gray-300 rounded bg-gray-700 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) =>
                            updateEducationField(i, "year", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded bg-gray-700 text-white"
                        />
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={addEducationItem}
                    className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-300"
                  >
                    + Add Education
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-1 text-white">Certifications</h4>
                  {editedQualifications.certifications.length === 0 && (
                    <p className="text-white">No certifications provided.</p>
                  )}
                  <ul className="space-y-2">
                    {editedQualifications.certifications.map((cert, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => updateCertification(i, e.target.value)}
                          className="flex-grow p-1 border border-gray-300 rounded bg-gray-700 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeCertification(i)}
                          className="text-red-400 font-bold hover:text-red-300 px-2"
                          aria-label="Remove Certification"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-300"
                  >
                    + Add Certification
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold mb-1 text-white">Skills</h4>
                  {editedQualifications.skills.length === 0 && (
                    <p className="text-white">No skills provided.</p>
                  )}
                  <ul className="space-y-2">
                    {editedQualifications.skills.map((skill, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(i, e.target.value)}
                          className="flex-grow p-1 border border-gray-300 rounded bg-gray-700 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(i)}
                          className="text-red-400 font-bold hover:text-red-300 px-2"
                          aria-label="Remove Skill"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-300"
                  >
                    + Add Skill
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h4 className="font-semibold mb-1 text-white">Education</h4>
                  {aiOutput.qualifications.education.length === 0 ? (
                    <p className="text-white">No education data provided.</p>
                  ) : (
                    <ul className="list-disc list-inside text-white">
                      {aiOutput.qualifications.education.map((edu, i) => (
                        <li key={i}>
                          <strong>{edu.degree}</strong>, {edu.institution} ({edu.year})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-1 text-white">Certifications</h4>
                  {aiOutput.qualifications.certifications.length === 0 ? (
                    <p className="text-white">No certifications provided.</p>
                  ) : (
                    <ul className="list-disc list-inside text-white">
                      {aiOutput.qualifications.certifications.map((cert, i) => (
                        <li key={i}>{cert}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-1 text-white">Skills</h4>
                  {aiOutput.qualifications.skills.length === 0 ? (
                    <p className="text-white">No skills provided.</p>
                  ) : (
                    <ul className="list-disc list-inside text-white">
                      {aiOutput.qualifications.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </section>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={toggleEdit}
              className="mt-8 px-6 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-300"
            >
              {isEditing ? "Save Changes" : "Edit Output"}
            </button>
            <button
              onClick={() => aiOutput && saveAsDOCX(aiOutput)}
              className="mt-8 px-6 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-300"
              disabled={!aiOutput}
            >
              Download as DOCX
            </button>
            <button
              onClick={saveAsPDF}
              className="mt-8 px-6 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-300"
              disabled={!aiOutput}
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}