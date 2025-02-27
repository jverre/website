import React, { useState, useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup } from 'codemirror';
import ThreeJsRenderer from './ThreeJsRenderer';

interface ThreeJsChatResponseProps {
  onCodeRequest: (code: string) => void;
}

const ThreeJsChatResponse: React.FC<ThreeJsChatResponseProps> = ({ onCodeRequest }) => {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPromptRef = useRef<string | null>(null);

  // Initialize code generation when prompt changes
  useEffect(() => {
    // Prevent duplicate API calls for the same prompt
    if (!prompt || prompt === lastPromptRef.current || isLoading) {
      return;
    }
    
    // Update last prompt to prevent duplicate calls
    lastPromptRef.current = prompt;
    
    // Clear previous errors
    setError(null);
    
    // Fetch Three.js code from our API
    const fetchThreeJsCode = async () => {
      setIsLoading(true);
      setGeneratedCode(''); // Clear previous code
      
      try {
        const response = await fetch('/api/generate-threejs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to generate Three.js code: ${response.status} ${response.statusText}`);
        }
        
        // Process the streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('Response body is null');
        
        let accumulatedCode = '';
        const decoder = new TextDecoder();
        
        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedCode += chunk;
          
          // Update the code as it streams in
          setGeneratedCode(accumulatedCode);
        }
        
        // Final decode
        const finalChunk = decoder.decode();
        if (finalChunk) {
          accumulatedCode += finalChunk;
        }
        
        // Store the generated code for display
        setGeneratedCode(accumulatedCode);
        onCodeRequest(accumulatedCode);
        
      } catch (error) {
        console.error('Error generating Three.js code:', error);
        setError('Failed to generate Three.js code from API.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThreeJsCode();
  }, [prompt, onCodeRequest, isLoading]);

  // Connect to the external input
  useEffect(() => {
    const handleExternalSubmit = (e: Event) => {
      e.preventDefault();
      const externalInput = document.getElementById('ascii-prompt') as HTMLInputElement;
      if (externalInput && externalInput.value.trim()) {
        const promptValue = externalInput.value.trim();
        setPrompt(promptValue);
        
        // Clear input
        externalInput.value = '';
      }
    };

    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', handleExternalSubmit);
      return () => {
        form.removeEventListener('submit', handleExternalSubmit);
      };
    }
  }, []);

  // Toggle code visibility
  const toggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible);
  };

  // CodeMirror editor reference
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  // Initialize CodeMirror when code becomes visible or update it when code changes
  useEffect(() => {
    if (isCodeVisible && editorRef.current && generatedCode) {
      if (!editorViewRef.current) {
        // Initialize CodeMirror if it doesn't exist
        const state = EditorState.create({
          doc: generatedCode,
          extensions: [
            basicSetup,
            javascript(),
            oneDark,
            EditorView.theme({
              "&": {
                height: "100%",
                fontSize: "14px"
              },
              ".cm-scroller": {
                overflow: "auto"
              },
              ".cm-gutters": {
                backgroundColor: "#1f2937",
                color: "#9ca3af",
                border: "none"
              },
              ".cm-lineNumbers .cm-gutterElement": {
                padding: "0 0.5rem 0 0.25rem"
              },
              ".cm-content": {
                caretColor: "#fff"
              },
              ".cm-line": {
                padding: "0 0.5rem"
              }
            }),
            EditorState.readOnly.of(true) // Read-only mode
          ],
        });
        
        const view = new EditorView({
          state,
          parent: editorRef.current
        });
        
        editorViewRef.current = view;
      } else {
        // Update the editor content when generatedCode changes
        editorViewRef.current.dispatch({
          changes: {
            from: 0,
            to: editorViewRef.current.state.doc.length,
            insert: generatedCode
          }
        });
      }
    }
    
    return () => {
      if (!isCodeVisible && editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, [isCodeVisible, generatedCode]);

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        alert('Three.js code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy code: ', err);
      });
  };

  return (
    <div className="flex flex-col h-full">
      {prompt ? (
        <>
          {/* Header */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Prompt: <span className="ml-1.5 text-blue-600 dark:text-blue-400 font-normal">"{prompt}"</span>
              </div>
              <button 
                onClick={() => {
                  setPrompt(null);
                  setGeneratedCode('');
                  setError(null);
                  setIsCodeVisible(false);
                  lastPromptRef.current = null;
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            
            {/* Loading or Code Preview */}
            <div className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generating Three.js code with Claude...</p>
                    {generatedCode && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Received {generatedCode.length} characters so far...
                      </p>
                    )}
                  </div>
                </div>
              ) : error ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="bg-gray-800 p-4 rounded-lg max-w-xs text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-white text-sm">{error}</p>
                    <button 
                      onClick={() => setError(null)} 
                      className="mt-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : generatedCode ? (
                <ThreeJsRenderer threeJsCode={generatedCode} />
              ) : (
                /* Intentionally left blank */
                <div className="w-full h-full"></div>
              )}
            </div>
          </div>
          
          {/* Code Toggle Button */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-2">
              <button 
                onClick={toggleCodeVisibility}
                className="flex items-center text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-md transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 mr-1.5 transition-transform ${isCodeVisible ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {isCodeVisible ? 'Hide Code' : 'Show Code'}
                {isLoading && generatedCode && (
                  <span className="ml-2 text-xs text-blue-500 animate-pulse">
                    Streaming...
                  </span>
                )}
              </button>
            </div>
            
            {isCodeVisible && generatedCode && (
              <button 
                onClick={handleCopyCode}
                className="flex items-center text-xs bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400 py-1 px-3 rounded-md transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Code
              </button>
            )}
          </div>
          
          {/* CodeMirror Editor */}
          {isCodeVisible && (
            <div className="rounded-lg overflow-hidden border border-gray-700 shadow-inner mb-4" style={{ height: "60vh", maxHeight: "800px" }}>
              <div ref={editorRef} className="w-full h-full" />
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <div className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Three.js Visualizer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Enter a prompt below to generate a Three.js visualization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeJsChatResponse; 