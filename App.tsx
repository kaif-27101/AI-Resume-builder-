import React, { useState, useCallback } from 'react';
import type { ResumeData } from './types';
import ResumeForm from './components/ResumeForm';
import ResumeDisplay from './components/ResumeDisplay';
import { generateResumeSection, translateText } from './services/geminiService';

function App() {
  const [formData, setFormData] = useState<ResumeData>({
    name: '',
    targetJobTitle: '',
    currentJobTitle: '',
    experience: '',
    education: '',
    skills: '',
    achievements: '',
    profilePicture: null,
  });
  const [originalResume, setOriginalResume] = useState<string>('');
  const [displayedResume, setDisplayedResume] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fontStyle, setFontStyle] = useState<string>('font-inter');
  const [backgroundColor, setBackgroundColor] = useState<string>('bg-white dark:bg-slate-900');

  const handleGenerate = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    setDisplayedResume('');
    setOriginalResume('');
    try {
      const result = await generateResumeSection(formData);
      setOriginalResume(result);
      setDisplayedResume(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Failed to generate resume: ${e.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [formData]);

  const handleTranslate = useCallback(async (language: string) => {
    if (!originalResume) return;

    if (language === 'English') {
      setDisplayedResume(originalResume);
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const translatedResult = await translateText(originalResume, language);
      setDisplayedResume(translatedResult);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Failed to translate resume: ${e.message}`);
      } else {
        setError('An unknown translation error occurred.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [originalResume]);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <header className="bg-transparent sticky top-0 z-10 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-slate-900/10 dark:border-slate-300/10">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              <span className="text-sky-500">AI</span> Resume Builder
            </h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ResumeForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGenerate}
              isLoading={isProcessing}
            />
          </div>
          <div>
            <ResumeDisplay 
              resumeText={displayedResume}
              isLoading={isProcessing}
              error={error}
              profilePicture={formData.profilePicture}
              name={formData.name}
              fontStyle={fontStyle}
              setFontStyle={setFontStyle}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              onTranslate={handleTranslate}
              hasContentToTranslate={!!originalResume}
            />
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="text-center py-6 border-t border-slate-900/10 dark:border-slate-300/10">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Powered by AI. Built with passion.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;