import React from 'react';
import type { ResumeData } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import UserIcon from './icons/UserIcon';

interface ResumeFormProps {
  formData: ResumeData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const FormField: React.FC<{
  id: keyof ResumeData;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  placeholder?: string;
}> = ({ id, label, value, onChange, isTextArea = false, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        id={id}
        name={id}
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all duration-200"
      />
    ) : (
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all duration-200"
      />
    )}
  </div>
);

const ResumeForm: React.FC<ResumeFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Your Professional Details</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div className="flex items-center space-x-6 py-2">
            <div 
                className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center cursor-pointer ring-2 ring-offset-4 dark:ring-offset-slate-900 ring-slate-200 dark:ring-slate-600 hover:ring-sky-500 transition-all duration-300 relative group"
                onClick={handleImageUploadClick}
                aria-label="Upload profile picture"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleImageUploadClick()}}
            >
                {formData.profilePicture ? (
                <img src={formData.profilePicture} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                <UserIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                )}
                 <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-semibold text-center">Change Photo</p>
                </div>
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Profile Picture</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click to upload. <br/> Recommended: 400x400px.</p>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField id="name" label="Full Name" value={formData.name} onChange={handleChange} placeholder="e.g., Jane Doe" />
            <FormField id="targetJobTitle" label="Target Job Title" value={formData.targetJobTitle} onChange={handleChange} placeholder="e.g., Senior Software Engineer" />
        </div>
        <FormField id="currentJobTitle" label="Current Job Title" value={formData.currentJobTitle} onChange={handleChange} placeholder="e.g., Software Engineer" />
        <FormField id="education" label="Education" value={formData.education} onChange={handleChange} placeholder="e.g., B.S. in Computer Science" />
        <FormField id="experience" label="Work Experience Summary" value={formData.experience} onChange={handleChange} isTextArea placeholder="Briefly describe your roles and responsibilities..." />
        <FormField id="skills" label="Skills" value={formData.skills} onChange={handleChange} isTextArea placeholder="e.g., React, TypeScript, Node.js..." />
        <FormField id="achievements" label="Key Achievements" value={formData.achievements} onChange={handleChange} isTextArea placeholder="List 2-3 major accomplishments..." />
        
        <div className="pt-4">
            <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-bold rounded-lg shadow-lg text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Generate Resume Section
                  </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeForm;
