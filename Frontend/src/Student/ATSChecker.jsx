import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import requiredSkills from "../data/requiredSkills";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ATSChecker() {
  const [score, setScore] = useState(null);
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ");
    }
    return text.toLowerCase();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    let text = "";

    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(file);
    } else {
      alert("Please upload a PDF resume for now.");
      setLoading(false);
      return;
    }

    const must = [];
    const miss = [];

    requiredSkills.must_have_skills.forEach((skill) => {
      text.includes(skill.toLowerCase()) ? must.push(skill) : miss.push(skill);
    });

    const optionalFound = requiredSkills.optional_skills.filter((skill) =>
      text.includes(skill.toLowerCase())
    );

    const mustScore = (must.length / requiredSkills.must_have_skills.length) * 70;
    const optionalScore = (optionalFound.length / requiredSkills.optional_skills.length) * 30;
    const totalScore = Math.round(mustScore + optionalScore);

    setScore(totalScore);
    setMatched([...must, ...optionalFound]);
    setMissing(miss);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">
        ATS Resume Score Checker
      </h2>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFile}
        className="block w-full mb-4"
      />
      {loading && <p className="text-gray-500">Analyzing resume...</p>}

      {score !== null && !loading && (
        <div>
          <p className="text-lg font-semibold mb-2">
            ATS Score: <span className="text-blue-600">{score}%</span>
          </p>

          <p className="font-medium text-green-600">Matched Skills:</p>
          <ul className="list-disc pl-6 mb-4">
            {matched.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <p className="font-medium text-red-600">Missing Skills:</p>
          <ul className="list-disc pl-6">
            {missing.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}