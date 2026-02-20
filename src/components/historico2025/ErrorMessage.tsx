import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50 border border-red-200 rounded-2xl">
      <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
      <p className="text-red-700 text-center font-medium max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
