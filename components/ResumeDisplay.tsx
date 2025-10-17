import React, { useState, useRef, useEffect } from 'react';
import DownloadIcon from './icons/DownloadIcon';
import EmptyStateIcon from './icons/EmptyStateIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import FontIcon from './icons/FontIcon';
import PaletteIcon from './icons/PaletteIcon';
import LanguageIcon from './icons/LanguageIcon';

interface ResumeDisplayProps {
  resumeText: string;
  isLoading: boolean;
  error: string | null;
  profilePicture: string | null;
  name: string;
  fontStyle: string;
  setFontStyle: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  onTranslate: (language: string) => void;
  hasContentToTranslate: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-6 animate-pulse p-4">
        <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="flex flex-col items-center space-y-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-8"></div>
        <div className="space-y-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-6"></div>
        <div className="space-y-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
    </div>
);

const ResumeContent: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-2 my-3 text-slate-700 dark:text-slate-300">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-4xl font-bold mb-1 text-slate-800 dark:text-white text-center tracking-tight">{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-medium mb-8 text-sky-600 dark:text-sky-400 text-center">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">{line.substring(4)}</h3>);
    } else if (line.startsWith('- ')) {
      listItems.push(line.substring(2));
    } else if (line.trim() !== '') {
      flushList();
      elements.push(<p key={index} className="my-2 text-slate-600 dark:text-slate-400 leading-relaxed">{line}</p>);
    }
  });

  flushList();

  return <>{elements}</>;
};

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeText, isLoading, error, profilePicture, name, fontStyle, setFontStyle, backgroundColor, setBackgroundColor, onTranslate, hasContentToTranslate }) => {
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const downloadDropdownRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const bgDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const fontOptions = [
    { name: 'Inter', className: 'font-inter' },
    { name: 'Lora', className: 'font-lora' },
    { name: 'Roboto Slab', className: 'font-roboto-slab' },
    { name: 'Source Sans Pro', className: 'font-source-sans-pro' },
    { name: 'Playfair Display', className: 'font-playfair-display' },
    { name: 'Dancing Script', className: 'font-dancing-script' },
  ];

  const backgroundOptions = [
    { name: 'White', className: 'bg-white dark:bg-slate-900' },
    { name: 'Light Gray', className: 'bg-slate-100 dark:bg-slate-800' },
    { name: 'Cream', className: 'bg-amber-50 dark:bg-amber-900/30' },
    { name: 'Pale Blue', className: 'bg-sky-50 dark:bg-sky-900/30' },
  ]

  const languageOptions = ['English', 'Hindi', 'Telugu', 'Urdu'];

  const handlePrint = () => {
    setIsDownloadDropdownOpen(false);
    window.print();
  };

  const handleDownloadMarkdown = () => {
    setIsDownloadDropdownOpen(false);
    if (!resumeText) return;
    
    const blob = new Blob([resumeText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = name ? name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'resume';
    link.href = url;
    link.setAttribute('download', `${safeName}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) setIsDownloadDropdownOpen(false);
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) setIsFontDropdownOpen(false);
      if (bgDropdownRef.current && !bgDropdownRef.current.contains(event.target as Node)) setIsBgDropdownOpen(false);
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) setIsLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasContent = !isLoading && !error && !!resumeText;
  const currentFontName = fontOptions.find(f => f.className === fontStyle)?.name || 'Inter';

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-md min-h-[500px] flex flex-col justify-center relative transition-all duration-300">
      {hasContentToTranslate && (
        <div id="download-btn-container" className="absolute top-6 right-6 z-20 flex items-center space-x-2">
          {/* BACKGROUND DROPDOWN */}
          <div className="relative" ref={bgDropdownRef}>
            <button
              onClick={() => setIsBgDropdownOpen(prev => !prev)}
              className="inline-flex items-center p-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg shadow-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm"
              aria-haspopup="true" aria-expanded={isBgDropdownOpen} aria-label="Background color options"
            >
              <PaletteIcon className="w-5 h-5" />
            </button>
            {isBgDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none" role="menu">
                <div className="py-1" role="none">
                  {backgroundOptions.map(bg => (
                    <button key={bg.name} onClick={() => { setBackgroundColor(bg.className); setIsBgDropdownOpen(false); }}
                      className={`w-full text-left flex items-center px-4 py-2 text-sm ${backgroundColor === bg.className ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`} role="menuitem"
                    >
                      <span className={`w-4 h-4 rounded-full mr-3 border border-slate-300 dark:border-slate-600 ${bg.className}`}></span>
                      {bg.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* TRANSLATE DROPDOWN */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(prev => !prev)}
              className="inline-flex items-center p-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg shadow-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm"
              aria-haspopup="true" aria-expanded={isLangDropdownOpen} aria-label="Translate options"
            >
              <LanguageIcon className="w-5 h-5" />
            </button>
            {isLangDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none" role="menu">
                <div className="py-1" role="none">
                  {languageOptions.map(lang => (
                    <button key={lang} onClick={() => { onTranslate(lang); setIsLangDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FONT STYLE DROPDOWN */}
          <div className="relative" ref={fontDropdownRef}>
            <button
              onClick={() => setIsFontDropdownOpen(prev => !prev)}
              className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg shadow-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm"
              aria-haspopup="true" aria-expanded={isFontDropdownOpen} aria-label="Font style options"
            >
              <FontIcon className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{currentFontName}</span>
              <ChevronDownIcon className="w-4 h-4 sm:ml-1.5" />
            </button>
             {isFontDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none" role="menu">
                <div className="py-1" role="none">
                  {fontOptions.map(font => (
                    <button key={font.className} onClick={() => { setFontStyle(font.className); setIsFontDropdownOpen(false); }} className={`w-full text-left block px-4 py-2 text-sm ${fontStyle === font.className ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`} role="menuitem">
                      <span className={font.className}>{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* DOWNLOAD DROPDOWN */}
          <div className="relative" ref={downloadDropdownRef}>
            <button onClick={() => setIsDownloadDropdownOpen(prev => !prev)} className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg shadow-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm" aria-haspopup="true" aria-expanded={isDownloadDropdownOpen} aria-label="Download options">
              <DownloadIcon className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
              <ChevronDownIcon className="w-4 h-4 sm:ml-1.5" />
            </button>
            {isDownloadDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none" role="menu">
                <div className="py-1" role="none">
                  <button onClick={handlePrint} className="w-full text-left text-slate-700 dark:text-slate-300 block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">Save as PDF</button>
                  <button onClick={handleDownloadMarkdown} className="w-full text-left text-slate-700 dark:text-slate-300 block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">Save as Markdown (.md)</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div id="printable-resume" className={`p-4 sm:p-8 ${fontStyle} ${backgroundColor} transition-colors duration-300 rounded-lg`}>
        {isLoading && <SkeletonLoader />}
        {error && (
            <div className="text-center text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full">
              <h3 className="font-semibold text-lg">An Error Occurred</h3>
              <p className="mt-2 text-sm">{error}</p>
            </div>
        )}
        {hasContent && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {profilePicture && (
                <div className="flex justify-center mb-8">
                    <img src={profilePicture} alt={name || 'Profile Picture'} className="w-36 h-36 rounded-full object-cover ring-4 ring-offset-4 ring-offset-white dark:ring-offset-slate-800 ring-slate-200 dark:ring-slate-600" />
                </div>
            )}
            <ResumeContent text={resumeText} />
          </div>
        )}
        {!isLoading && !error && !resumeText && (
            <div className="text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center h-full py-10">
                <EmptyStateIcon className="w-24 h-24 text-slate-300 dark:text-slate-600" />
                <h3 className="font-semibold text-lg mt-6">Your AI-Generated Resume Will Appear Here</h3>
                <p className="mt-2 max-w-xs mx-auto">Fill out the form and click "Generate" to see the magic happen.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDisplay;