import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { calculateAtsScore, getAtsScore } from '../lib/api';

// Update worker source to use specific version
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

export default function ATSChecker() {
  const [score, setScore] = useState(null);
  const [storedScore, setStoredScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAtsScore();
  }, []);

  const fetchAtsScore = async () => {
    try {
      const response = await getAtsScore();
      // console.log('[ATSChecker] Fetched stored score:', response);
      if (response.ats_score) {  // Changed from total_score to ats_score
        setStoredScore(response.ats_score);
        setScore(response.ats_score);
      }
    } catch (error) {
      // console.error('[ATSChecker] Error fetching score:', error);
      setError('Failed to fetch existing ATS score');
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      
      // console.log('[ATSChecker] Processing PDF with', pdf.numPages, 'pages');
      
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ");
      }
      return text;
    } catch (error) {
      // console.error('[ATSChecker] PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      if (file.type === "application/pdf") {
        // console.log('[ATSChecker] Processing file:', file.name);
        const resumeText = await extractTextFromPDF(file);
        console.log('[ATSChecker] Extracted text length:', resumeText.length);
        
        const response = await calculateAtsScore(resumeText);
        // console.log('[ATSChecker] Score response:', response);
        
        if (response.total_score !== undefined) {
          setScore(response.total_score);
          setStoredScore(response.total_score); // Update stored score with new score
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        setError("Please upload a PDF resume");
      }
    } catch (error) {
      // console.error('[ATSChecker] Processing error:', error);
      setError(error.message || 'Error analyzing resume');
      setScore(storedScore); // Revert to stored score on error
    } finally {
      setLoading(false);
    }
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
        className="block w-full p-2 mb-4 border rounded hover:border-blue-500 focus:outline-none focus:border-blue-600"
      />
      
      {loading && (
        <div className="text-center text-gray-600">
          <p className="animate-pulse">Analyzing resume...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-600 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {(score !== null || storedScore !== null) && !loading && (
        <div className="text-center">
          <p className="text-2xl font-bold">
            ATS Score: 
            <span className={`ml-2 ${(score || storedScore) >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {score || storedScore}%
            </span>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {(score || storedScore) >= 70 
              ? 'Great! Your resume is well-optimized for ATS systems.'
              : 'Consider improving your resume to better match ATS requirements.'}
          </p>
        </div>
      )}
    </div>
  );
}