import React, { useState, useRef } from 'react'
import '../style/UserHome.css'
import { useNavigate } from 'react-router-dom'

const MAX_FILES = 5
const MAX_SIZE_MB = 2

function Home() {
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFiles = (selectedFiles) => {
    let newFiles = Array.from(selectedFiles)
    newFiles = newFiles.filter(file =>
      (file.type === 'application/pdf' || file.name.endsWith('.docx')) &&
      file.size <= MAX_SIZE_MB * 1024 * 1024
    )
    if (files.length + newFiles.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} files.`)
      return
    }
    setFiles(prev => [...prev, ...newFiles])
    setError('')
  }

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }
  const handleDragOver = (e) => e.preventDefault()

  const goToJobDescription = () => {
    if (files.length === 0) {
      setError('Please upload at least one resume file.')
      return
    }
    navigate('/job-description', { state: { files } })
  }

  return (
    <div className="home-container">
      <div className="home-section">
        <h1 className="home-title">
          The Smarter Way To<br />Optimize Your Resume
        </h1>

        <p className="home-subtext">
          Upload multiple resumes to get a ranked list matched to your target job.
        </p>

        <div
          className="home-upload-box"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label htmlFor="resumeUpload" className="home-upload-label">
            Drag & drop PDF/DOCX files here or&nbsp;
            <span
              className="home-upload-button"
              onClick={() => fileInputRef.current.click()}
              tabIndex={0}
              role="button"
            >
              Browse
            </span>
          </label>

          <input
            type="file"
            id="resumeUpload"
            ref={fileInputRef}
            accept=".pdf,.docx"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />

          <div style={{ listStyle: 'none', padding: 0 }}>
            {files.length === 0 && <span>No files selected.</span>}
            {files.length > 0 && (
              <ul>
                {files.map((file, idx) => (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button
                      style={{
                        marginLeft: 12,
                        color: 'var(--color-purple)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      onClick={() => removeFile(idx)}
                      aria-label={`Remove ${file.name}`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="home-file-info">
            {error && <span style={{ color: 'var(--color-error)' }}>{error}</span>}
            {!error && (
              <span>
                PDF & DOCX only. Max {MAX_FILES} files, {MAX_SIZE_MB}MB each.
              </span>
            )}
          </div>
        </div>

        <p className="home-note">
          *Next, you'll need to upload or paste the Job Description
        </p>
        <button
          onClick={goToJobDescription}
          style={{
            marginTop: '32px',
            background: 'var(--gradient-light)',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            fontWeight: 600,
            fontSize: '1.1em',
            padding: '12px 36px',
            cursor: files.length === 0 ? 'not-allowed' : 'pointer',
            opacity: files.length === 0 ? 0.6 : 1,
            transition: 'background 0.2s'
          }}
          disabled={files.length === 0}
        >
          Next: Paste Job Description
        </button>
      </div>
    </div>
  )
}

export default Home