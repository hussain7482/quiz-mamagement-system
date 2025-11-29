'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchQuiz, submitQuiz, type Quiz, type Question } from '@/lib/api';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.id);
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const data = await fetchQuiz(quizId);
      setQuiz(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, response: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quiz) return;

    // Validate all questions are answered
    const unansweredQuestions = quiz.questions?.filter(
      (q) => !answers[q.id]
    );
    
    if (unansweredQuestions && unansweredQuestions.length > 0) {
      setError(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const answerArray = Object.entries(answers).map(([questionId, response]) => ({
        question_id: Number(questionId),
        response,
      }));

      // For demo purposes, using default user ID and role
      // In production, get these from authentication context
      const result = await submitQuiz(quizId, answerArray, '1', 'user');
      
      // Redirect to results page
      router.push(`/quiz/${quizId}/result?score=${result.score}&total=${result.total_questions}&quizTitle=${encodeURIComponent(result.quiz?.title || quiz.title)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-gray-300 mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white mb-4 transition-colors"
            >
              ← Back to Quizzes
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">{quiz.title}</h1>
            <p className="text-gray-400">
              {quiz.questions?.length || 0} question{quiz.questions?.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Quiz Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz.questions?.map((question, index) => (
              <div
                key={question.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg"
              >
                <div className="mb-4">
                  <span className="text-purple-400 font-semibold">Question {index + 1}</span>
                  <p className="text-white text-lg mt-2">{question.context}</p>
                </div>

                {/* True/False Questions */}
                {question.qtype === 'true_false' && (
                  <div className="space-y-3">
                    {question.options?.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border border-transparent hover:border-purple-500"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={answers[question.id] === String(option.id)}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="mr-3 w-5 h-5 text-purple-600"
                        />
                        <span className="text-white">{option.content}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* MCQ Questions */}
                {question.qtype === 'mcq' && (
                  <div className="space-y-3">
                    {question.options?.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border border-transparent hover:border-purple-500"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={answers[question.id] === String(option.id)}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="mr-3 w-5 h-5 text-purple-600"
                        />
                        <span className="text-white">{option.content}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Text Questions */}
                {question.qtype === 'text' && (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    rows={4}
                  />
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-2xl">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

