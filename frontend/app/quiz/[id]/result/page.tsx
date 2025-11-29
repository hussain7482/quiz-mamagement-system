'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function QuizResultContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const total = searchParams.get('total');
  const quizTitle = searchParams.get('quizTitle');

  const scoreNum = score ? Number(score) : 0;
  const totalNum = total ? Number(total) : 1;
  const percentage = Math.round((scoreNum / totalNum) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Outstanding! 🎉';
    if (percentage >= 80) return 'Great Job! 👏';
    if (percentage >= 60) return 'Good Effort! 👍';
    if (percentage >= 40) return 'Keep Practicing! 💪';
    return 'Try Again! 📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 shadow-2xl text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Quiz Results</h1>
            
            <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-r ${getScoreColor()} mb-8 shadow-lg`}>
              <span className="text-5xl font-bold text-white">{percentage}%</span>
            </div>
            
            <h2 className="text-3xl font-semibold text-white mb-4">{getScoreMessage()}</h2>
            <p className="text-gray-300 text-xl mb-6">
              You scored <span className="font-bold text-purple-400">{scoreNum}</span> out of{' '}
              <span className="font-bold text-purple-400">{totalNum}</span>
            </p>
            
            {quizTitle && (
              <p className="text-gray-400 text-lg mb-8">Quiz: {decodeURIComponent(quizTitle)}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              <Link
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Back to Quizzes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <QuizResultContent />
    </Suspense>
  );
}
