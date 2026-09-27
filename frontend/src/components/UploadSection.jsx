import React, { useState } from 'react';
import { Upload, FileType, Activity } from 'lucide-react';
import { analyzeFile } from '../api';

export default function UploadSection({ onResults, onAnalyzeStart, analyzing }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (uploadedFile) => {
    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid CSV or Excel file.");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    onAnalyzeStart();
    
    try {
      const data = await analyzeFile(file);
      onResults(data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert(error.message || "Failed to connect to backend. Make sure the FastAPI server is running on port 8000.");
      onResults(null); // to reset loading state
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, justifyContent: 'center', margin: '2rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Dataset Upload</h2>
        
        <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
          <input 
            type="file" 
            id="file-upload" 
            className="file-input" 
            accept=".csv, .xlsx, .xls"
            onChange={handleChange} 
          />
          <label 
            htmlFor="file-upload" 
            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${analyzing ? 'analyzing-pulse' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {analyzing ? (
              <>
                <Activity className="upload-icon" style={{ animation: 'spin 2s linear infinite' }} />
                <p className="upload-title">Processing Temporal Graph...</p>
                <p className="upload-subtitle">Running EvolveGCN inference across timesteps</p>
              </>
            ) : file ? (
              <>
                <FileType className="upload-icon" style={{ color: 'var(--success)' }} />
                <p className="upload-title">{file.name}</p>
                <p className="upload-subtitle">{(file.size / (1024*1024)).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <Upload className="upload-icon" />
                <p className="upload-title">Drag & drop your transaction dataset</p>
                <p className="upload-subtitle">Supports .CSV, .XLSX (Max 1GB)</p>
              </>
            )}
          </label>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn" 
            onClick={handleAnalyze} 
            disabled={!file || analyzing}
            style={{ width: '200px' }}
          >
            {analyzing ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>
    </main>
  );
}
