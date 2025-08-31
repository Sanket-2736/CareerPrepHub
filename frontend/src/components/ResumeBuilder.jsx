import React, { useState } from 'react';
import { apiCall } from '../utils/api';

const ResumeBuilder = ({ userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    skills: '',
    certifications: '',
    awards: '',
    publications: '',
    languages: '',
    interests: ''
  });

  // Dynamic arrays for complex fields
  const [education, setEducation] = useState([{ degree: '', institution: '', year: '', gpa: '' }]);
  const [experience, setExperience] = useState([{ company: '', role: '', duration: '', description: '' }]);
  const [projects, setProjects] = useState([{ title: '', description: '', technologies: '', link: '' }]);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Education handlers
  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: '', gpa: '' }]);
  };

  const removeEducation = (index) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updated = education.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setEducation(updated);
  };

  // Experience handlers
  const addExperience = () => {
    setExperience([...experience, { company: '', role: '', duration: '', description: '' }]);
  };

  const removeExperience = (index) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = experience.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setExperience(updated);
  };

  // Project handlers
  const addProject = () => {
    setProjects([...projects, { title: '', description: '', technologies: '', link: '' }]);
  };

  const removeProject = (index) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const handleProjectChange = (index, field, value) => {
    const updated = projects.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setProjects(updated);
  };

  // Filter out empty entries
  const filterEmptyEntries = (array) => {
    return array.filter(item => 
      Object.values(item).some(value => value && value.trim() !== '')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Starting resume submission process...');

    try {
      // Convert comma-separated strings to arrays and filter empty values
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
      const certificationsArray = formData.certifications ? formData.certifications.split(',').map(s => s.trim()).filter(s => s) : [];
      const awardsArray = formData.awards ? formData.awards.split(',').map(s => s.trim()).filter(s => s) : [];
      const publicationsArray = formData.publications ? formData.publications.split(',').map(s => s.trim()).filter(s => s) : [];
      const languagesArray = formData.languages ? formData.languages.split(',').map(s => s.trim()).filter(s => s) : [];
      const interestsArray = formData.interests ? formData.interests.split(',').map(s => s.trim()).filter(s => s) : [];

      // Filter out empty entries from dynamic arrays
      const filteredEducation = filterEmptyEntries(education);
      const filteredExperience = filterEmptyEntries(experience);
      const filteredProjects = filterEmptyEntries(projects);

      console.log('Processed data:', {
        education: filteredEducation,
        experience: filteredExperience,
        projects: filteredProjects,
        skills: skillsArray
      });

      const payload = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        linkedin: formData.linkedin || '',
        github: formData.github || '',
        portfolio: formData.portfolio || '',
        summary: formData.summary || '',
        skills: skillsArray,
        certifications: certificationsArray,
        awards: awardsArray,
        publications: publicationsArray,
        languages: languagesArray,
        interests: interestsArray,
        education: filteredEducation,
        experience: filteredExperience,
        projects: filteredProjects
      };

      console.log('Final payload:', payload);

      const data = await apiCall('/api/resume/build', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      console.log('API response:', data);
      setResume(data.resume);

    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Error creating resume: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = () => {
    if (!resume) return;
    
    const formatContent = (content) => {
      if (!content) return '';
      if (Array.isArray(content)) {
        return content.map(item => {
          if (typeof item === 'object' && item !== null) {
            return Object.entries(item)
              .filter(([key, value]) => value && value.toString().trim())
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
          }
          return item;
        }).join('\n');
      }
      if (typeof content === 'string') {
        return content;
      }
      return String(content);
    };

    const resumeContent = `
RESUME

Name: ${resume.name}
Email: ${resume.email}
Phone: ${resume.phone}
${resume.address ? `Address: ${resume.address}` : ''}
${resume.linkedin ? `LinkedIn: ${resume.linkedin}` : ''}
${resume.github ? `GitHub: ${resume.github}` : ''}
${resume.portfolio ? `Portfolio: ${resume.portfolio}` : ''}

${resume.summary ? `SUMMARY:\n${resume.summary}\n` : ''}

${resume.education && resume.education.length > 0 ? `EDUCATION:\n${formatContent(resume.education)}\n` : ''}

${resume.experience && resume.experience.length > 0 ? `EXPERIENCE:\n${formatContent(resume.experience)}\n` : ''}

${resume.projects && resume.projects.length > 0 ? `PROJECTS:\n${formatContent(resume.projects)}\n` : ''}

${resume.skills && resume.skills.length > 0 ? `SKILLS:\n${resume.skills.join(', ')}\n` : ''}

${resume.certifications && resume.certifications.length > 0 ? `CERTIFICATIONS:\n${resume.certifications.join(', ')}\n` : ''}

${resume.awards && resume.awards.length > 0 ? `AWARDS:\n${resume.awards.join(', ')}\n` : ''}

${resume.publications && resume.publications.length > 0 ? `PUBLICATIONS:\n${resume.publications.join(', ')}\n` : ''}

${resume.languages && resume.languages.length > 0 ? `LANGUAGES:\n${resume.languages.join(', ')}\n` : ''}

${resume.interests && resume.interests.length > 0 ? `INTERESTS:\n${resume.interests.join(', ')}\n` : ''}
    `.replace(/\n\s*\n/g, '\n');

    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.name}_resume.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Builder</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="max-h-screen overflow-y-auto pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <InputField label="Full Name *" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                  <InputField label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" />
                  <InputField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
                  <InputField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="City, Country" />
                  <InputField label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/yourname" />
                  <InputField label="GitHub" name="github" value={formData.github} onChange={handleChange} placeholder="github.com/username" />
                  <InputField label="Portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="yourportfolio.com" />
                </div>
              </div>

              {/* Professional Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
                <TextareaField name="summary" value={formData.summary} onChange={handleChange} rows="3" placeholder="Brief summary of your professional background..." />
              </div>

              {/* Education */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <button type="button" onClick={addEducation} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    + Add Education
                  </button>
                </div>
                {education.map((edu, index) => (
                  <div key={index} className="border border-gray-300 p-3 rounded mb-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      {education.length > 1 && (
                        <button type="button" onClick={() => removeEducation(index)} className="text-red-600 text-sm hover:text-red-800">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} />
                      <InputField placeholder="Institution" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} />
                      <InputField placeholder="Year" value={edu.year} onChange={(e) => handleEducationChange(index, 'year', e.target.value)} />
                      <InputField placeholder="GPA (optional)" value={edu.gpa} onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Experience</h3>
                  <button type="button" onClick={addExperience} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    + Add Experience
                  </button>
                </div>
                {experience.map((exp, index) => (
                  <div key={index} className="border border-gray-300 p-3 rounded mb-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      {experience.length > 1 && (
                        <button type="button" onClick={() => removeExperience(index)} className="text-red-600 text-sm hover:text-red-800">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <InputField placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} />
                        <InputField placeholder="Role" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} />
                      </div>
                      <InputField placeholder="Duration (e.g., 2021-2023)" value={exp.duration} onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)} />
                      <textarea
                        placeholder="Description of responsibilities and achievements"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <button type="button" onClick={addProject} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    + Add Project
                  </button>
                </div>
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-300 p-3 rounded mb-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Project {index + 1}</h4>
                      {projects.length > 1 && (
                        <button type="button" onClick={() => removeProject(index)} className="text-red-600 text-sm hover:text-red-800">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <InputField placeholder="Project Title" value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                      <textarea
                        placeholder="Project Description"
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <InputField placeholder="Technologies Used" value={project.technologies} onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)} />
                      <InputField placeholder="Project Link (optional)" value={project.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Other Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <InputField label="Skills (comma separated) *" name="skills" value={formData.skills} onChange={handleChange} required placeholder="JavaScript, Python, React, etc." />
                  <InputField label="Certifications (comma separated)" name="certifications" value={formData.certifications} onChange={handleChange} placeholder="AWS Certified, PMP, etc." />
                  <InputField label="Awards (comma separated)" name="awards" value={formData.awards} onChange={handleChange} placeholder="Best Developer 2022, Hackathon Winner" />
                  <InputField label="Publications (comma separated)" name="publications" value={formData.publications} onChange={handleChange} placeholder="Research papers, blogs" />
                  <InputField label="Languages (comma separated)" name="languages" value={formData.languages} onChange={handleChange} placeholder="English, Spanish, Hindi" />
                  <InputField label="Interests (comma separated)" name="interests" value={formData.interests} onChange={handleChange} placeholder="Photography, Traveling, Chess" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Creating Resume...' : 'Create Resume'}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="max-h-screen overflow-y-auto">
            <ResumePreview resume={resume} downloadResume={downloadResume} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Resume Preview Component */
const ResumePreview = ({ resume, downloadResume }) => {
  if (!resume) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg h-full flex items-center justify-center">
        <p className="text-gray-500">Resume preview will appear here</p>
      </div>
    );
  }

  return (
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
          {resume.address && <p className="text-gray-600">{resume.address}</p>}
          <p className="text-gray-600">
            {resume.linkedin && <span>LinkedIn: {resume.linkedin} | </span>}
            {resume.github && <span>GitHub: {resume.github} | </span>}
            {resume.portfolio && <span>Portfolio: {resume.portfolio}</span>}
          </p>
        </div>

        {resume.summary && <Section title="SUMMARY" content={resume.summary} />}
        {resume.education && resume.education.length > 0 && <Section title="EDUCATION" content={resume.education} />}
        {resume.experience && resume.experience.length > 0 && <Section title="EXPERIENCE" content={resume.experience} />}
        {resume.projects && resume.projects.length > 0 && <Section title="PROJECTS" content={resume.projects} />}
        {resume.skills && resume.skills.length > 0 && <Section title="SKILLS" content={resume.skills.join(', ')} />}
        {resume.certifications && resume.certifications.length > 0 && <Section title="CERTIFICATIONS" content={resume.certifications.join(', ')} />}
        {resume.awards && resume.awards.length > 0 && <Section title="AWARDS" content={resume.awards.join(', ')} />}
        {resume.publications && resume.publications.length > 0 && <Section title="PUBLICATIONS" content={resume.publications.join(', ')} />}
        {resume.languages && resume.languages.length > 0 && <Section title="LANGUAGES" content={resume.languages.join(', ')} />}
        {resume.interests && resume.interests.length > 0 && <Section title="INTERESTS" content={resume.interests.join(', ')} />}
      </div>
    </div>
  );
};

/* Section component */
const Section = ({ title, content }) => {
  const renderContent = (content) => {
    if (!content) return '';
    
    if (Array.isArray(content)) {
      return content.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const entries = Object.entries(item).filter(([key, value]) => value && value.toString().trim());
          return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
        }
        return item;
      }).join('\n');
    }
    
    return String(content);
  };

  return (
    <div>
      <h5 className="font-semibold text-gray-800">{title}</h5>
      <div className="text-gray-700 whitespace-pre-line">{renderContent(content)}</div>
    </div>
  );
};

/* Reusable form components */
const InputField = ({ label, name, value, onChange, type = "text", required = false, placeholder }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange, rows = 3, required = false, placeholder }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
    />
  </div>
);

export default ResumeBuilder;