import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { calculateAtsScore, getAtsScore } from "../lib/api";
import { COLORS } from "../constants/colors";

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
    NProgress.start(); // Start progress bar

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
      NProgress.done(); // End progress bar
    }
  };

  return (
    <div 
      className="p-6 rounded-2xl shadow mt-8"
      style={{ 
        backgroundColor: COLORS.card,
        boxShadow: `0 4px 6px ${COLORS.shadow}`,
        border: `1px solid ${COLORS.border}`
      }}
    >
      <h2 
        className="text-xl font-bold mb-4 text-center"
        style={{ color: COLORS.text }}
      >
        ATS Resume Score Checker
      </h2>
      
      <input
        type="file"
        accept=".pdf"
        onChange={handleFile}
        className="block w-full p-2 mb-4 rounded transition-all duration-200"
        style={{
          border: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.background,
          color: COLORS.text,
        }}
      />
      
      {loading && (
        <div 
          className="text-center animate-pulse"
          style={{ color: COLORS.textLight }}
        >
          <p>Analyzing resume...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center mb-4" style={{ color: COLORS.expense }}>
          <p>{error}</p>
        </div>
      )}
      
      {(score !== null || storedScore !== null) && !loading && (
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: COLORS.text }}
          >
            ATS Score: 
            <span 
              className="ml-2"
              style={{ 
                color: (score || storedScore) >= 70 ? COLORS.success : COLORS.expense 
              }}
            >
              {score || storedScore}%
            </span>
          </p>
          <p 
            className="mt-2 text-sm"
            style={{ color: COLORS.textLight }}
          >
            {(score || storedScore) >= 70 
              ? 'Great! Your resume is well-optimized for ATS systems.'
              : 'Consider improving your resume to better match ATS requirements.'}
          </p>
        </div>
      )}
    </div>
  );
}