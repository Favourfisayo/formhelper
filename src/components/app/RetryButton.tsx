import { Button } from "../ui/button";
interface RetryButtonProps {
  onRetry: () => void;
  isRetrying: boolean;
  error?: string;
  operation?: string;
}

export function RetryButton({ onRetry, isRetrying, error, operation = "operation" }: RetryButtonProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex">
          <div className="text-red-400">⚠️</div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {operation} failed
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          {isRetrying ? "Retrying..." : "Retry"}
        </Button>
      </div>
    </div>
  );
}