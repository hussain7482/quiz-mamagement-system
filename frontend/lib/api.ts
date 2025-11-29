const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface Quiz {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  quiz_id: number;
  context: string;
  qtype: 'true_false' | 'mcq' | 'text';
  created_at: string;
  updated_at: string;
  options?: Option[];
}

export interface Option {
  id: number;
  question_id: number;
  content: string;
  correct: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attempt {
  id: number;
  quiz_id: number;
  sore: number;
  created_at: string;
  updated_at: string;
  quiz?: Quiz;
  answers?: Answer[];
}

export interface Answer {
  id: number;
  attempt_id: number;
  question_id: number;
  response: string;
  created_at: string;
  updated_at: string;
  question?: Question;
}

// API functions
export async function fetchQuizzes(): Promise<Quiz[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes`);
  if (!response.ok) throw new Error('Failed to fetch quizzes');
  return response.json();
}

export async function fetchQuiz(id: number): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch quiz');
  return response.json();
}

export async function createQuiz(title: string, userId: string, userRole: string): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      'X-User-Role': userRole,
    },
    body: JSON.stringify({ quiz: { title } }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(', ') || 'Failed to create quiz');
  }
  return response.json();
}

export async function createQuestion(
  quizId: number,
  context: string,
  qtype: 'true_false' | 'mcq' | 'text',
  options: { content: string; correct: boolean }[],
  userId: string,
  userRole: string
): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      'X-User-Role': userRole,
    },
    body: JSON.stringify({
      question: { context, qtype },
      options,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(', ') || 'Failed to create question');
  }
  return response.json();
}

export async function submitQuiz(
  quizId: number,
  answers: { question_id: number; response: string }[],
  userId: string,
  userRole: string
): Promise<{ attempt: Attempt; score: number; total_questions: number; quiz: Quiz }> {
  const response = await fetch(`${API_BASE_URL}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      'X-User-Role': userRole,
    },
    body: JSON.stringify({
      quiz_id: quizId,
      answers,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(', ') || 'Failed to submit quiz');
  }
  return response.json();
}

export async function fetchAttempt(id: number, userId: string, userRole: string): Promise<Attempt> {
  const response = await fetch(`${API_BASE_URL}/attempts/${id}`, {
    headers: {
      'X-User-Id': userId,
      'X-User-Role': userRole,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch attempt');
  return response.json();
}

