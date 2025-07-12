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

  // Add this function to navigate to Job Description page
  const goToJobDescription = () => {
    if (files.length === 0) {
      setError('Please upload at least one resume file.')
      return
    }
    navigate('/job-description', { state: { files } })
  }


  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 128px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      background: 'var(--gradient-dark)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        padding: '40px',
        borderRadius: '20px',
        background: 'rgba(28, 21, 38, 0.7)',
        boxShadow: '0 8px 32px rgba(28, 21, 38, 0.2)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.8em',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: 'var(--color-light)'
        }}>
          The Smarter Way To<br />Optimize Your Resume
        </h1>

        <p style={{
          color: 'var(--color-purple-light)',
          marginBottom: '32px',
          fontSize: '1.1em'
        }}>
          Upload multiple resumes to get a ranked list matched to your target job.
        </p>

        <div
          style={{
            background: 'rgba(152, 75, 254, 0.08)',
            border: '1px solid var(--color-purple)',
            borderRadius: '15px',
            padding: '30px 20px',
            margin: '32px 0'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label htmlFor="resumeUpload" style={{
            display: 'block',
            marginBottom: '15px',
            color: 'var(--color-light)'
          }}>
            Drag & drop PDF/DOCX files here or&nbsp;
            <span
              style={{
                background: 'var(--gradient-light)',
                padding: '10px 30px',
                color: 'white',
                borderRadius: '999px',
                display: 'inline-block',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px',
                transition: 'background 0.3s'
              }}
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
                        color: '#984BFE',
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
          <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--color-purple-light)' }}>
            {error && <span style={{ color: 'red' }}>{error}</span>}
            {!error && (
              <span>
                PDF & DOCX only. Max {MAX_FILES} files, {MAX_SIZE_MB}MB each.
              </span>
            )}
          </div>
        </div>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-light)',
          marginTop: '25px'
        }}>
          *Next, you'll need to upload or paste the Job Description
        </p>
        <button
          onClick={goToJobDescription}
          style={{
            marginTop: '32px',
            background: 'linear-gradient(90deg, #984BFE 0%, #C799FD 100%)',
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