import React, { useState } from 'react';

const ResumeBuilder = ({ userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
    summary: ''
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      
      const response = await fetch('http://localhost:8000/api/resume/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray
        })
      });

      const data = await response.json();
      setResume(data.resume);
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Error creating resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = () => {
    const resumeContent = `
RESUME

Name: ${resume.name}
Email: ${resume.email}
Phone: ${resume.phone}

SUMMARY:
${resume.summary}

EDUCATION:
${resume.education}

EXPERIENCE:
${resume.experience}

SKILLS:
${resume.skills.join(', ')}
    `;

    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.name}_resume.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Builder</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of your professional background..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education *
                </label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your educational background..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your work experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated) *
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="JavaScript, Python, React, etc."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating Resume...' : 'Create Resume'}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div>
            {resume ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
                  <button
                    onClick={downloadResume}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                  >
                    Download
                  </button>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-lg">{resume.name}</h4>
                    <p className="text-gray-600">{resume.email} | {resume.phone}</p>
                  </div>
                  
                  {resume.summary && (
                    <div>
                      <h5 className="font-semibold text-gray-800">SUMMARY</h5>
                      <p className="text-gray-700">{resume.summary}</p>
                    </div>
                  )}
                  
                  <div>
                    <h5 className="font-semibold text-gray-800">EDUCATION</h5>
                    <p className="text-gray-700">{resume.education}</p>
                  </div>
                  
                  {resume.experience && (
                    <div>
                      <h5 className="font-semibold text-gray-800">EXPERIENCE</h5>
                      <p className="text-gray-700">{resume.experience}</p>
                    </div>
                  )}
                  
                  <div>
                    <h5 className="font-semibold text-gray-800">SKILLS</h5>
                    <p className="text-gray-700">{resume.skills.join(', ')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg h-full flex items-center justify-center">
                <p className="text-gray-500">Resume preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
