import { useState } from 'react'
import { Bot, Send, Loader } from 'lucide-react'
import OpenAI from 'openai'

interface AIResponseSuggestorProps {
  variant: 'email' | 'summary';
  context?: string;
  onSuggestion?: (suggestion: string) => void;
}

export function AIResponseSuggestor({ variant, context, onSuggestion }: AIResponseSuggestorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [prompt, setPrompt] = useState('');

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
  });

  const generateSuggestion = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      let systemPrompt = '';
      let userPrompt = '';

      if (variant === 'email') {
        systemPrompt = 'You are a professional email assistant. Generate clear, professional email responses based on the context provided.';
        userPrompt = `Context: ${context || 'General business communication'}\n\nRequest: ${prompt}\n\nGenerate a professional email response:`;
      } else {
        systemPrompt = 'You are an expert at summarizing customer interactions and conversations. Provide clear, actionable summaries.';
        userPrompt = `Interaction details: ${context || prompt}\n\nProvide a concise summary highlighting key points and any required follow-up actions:`;
      }

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const generatedText = completion.choices[0]?.message?.content || '';
      setSuggestion(generatedText);
      onSuggestion?.(generatedText);
    } catch (error) {
      console.error('AI generation error:', error);
      setSuggestion('Sorry, I could not generate a suggestion at this time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center mb-4">
        <Bot className="h-5 w-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">
          AI {variant === 'email' ? 'Email Assistant' : 'Summary Generator'}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {variant === 'email' ? 'Describe the email you need to write:' : 'Enter interaction details to summarize:'}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              variant === 'email' 
                ? 'e.g., "Follow up on our meeting about the Q1 project proposal"'
                : 'e.g., "Had a 30-minute call with client about their requirements..."'
            }
            className="input-field w-full resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={generateSuggestion}
          disabled={isLoading || !prompt.trim()}
          className="btn-primary flex items-center w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Generating...' : 'Generate Suggestion'}
        </button>

        {suggestion && (
          <div className="bg-dark-700 border border-dark-600 rounded-md p-4">
            <h4 className="text-sm font-medium text-white mb-2">AI Suggestion:</h4>
            <div className="text-dark-300 whitespace-pre-wrap text-sm">
              {suggestion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
