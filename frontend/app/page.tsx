'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchQuizzes, type Quiz } from '@/lib/api';

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await fetchQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Quiz Management System</h1>
            <p className="text-gray-300 text-lg">Test your knowledge with our quizzes</p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link
                href="/admin"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                Admin Panel
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-gray-300 mt-4">Loading quizzes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Quiz List */}
          {!loading && !error && (
            <>
              {quizzes.length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700">
                  <p className="text-gray-400 text-lg">No quizzes available yet.</p>
                  <Link
                    href="/admin"
                    className="mt-4 inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Create Your First Quiz
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all shadow-lg hover:shadow-xl"
                    >
                      <h2 className="text-2xl font-bold text-white mb-3">{quiz.title}</h2>
                      <p className="text-gray-400 mb-4">
                        {quiz.questions?.length || 0} question{quiz.questions?.length !== 1 ? 's' : ''}
                      </p>
                      <Link
                        href={`/quiz/${quiz.id}`}
                        className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                      >
                        Take Quiz
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
