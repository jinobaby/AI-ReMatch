import React, { useState } from 'react'
import '../style/UserHome.css'

function Home() {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : '');
  };

  return (
    <div className="home-container">
      <div className="home-section">
        <h1 className="home-title">The Smarter Way To <br /> Optimize Your Resume</h1>
        <p className="home-subtext">
          Upload your resume to get a personalized score and actionable improvement suggestions, matched to your target job.
        </p>

        <div className="home-upload-box">
          <label htmlFor="resumeUpload" className="home-upload-label">
            Drop your resume here or choose a file
          </label>
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />
          <label htmlFor="resumeUpload" className="home-upload-button">Upload Your Resume</label>
          <p className="home-file-info">{fileName ? `${fileName} selected` : 'PDF & DOCX only. Max 2MB file size'}</p>
        </div>

        <p className="home-note">*Next, you’ll need to upload or paste the Job Description</p>
      </div>
    </div>
  )
}

export default Home