type Props = {
  message: string;
  actionText?: string;
  onAction?: () => void;
};

const ErrorBox = ({ message, actionText, onAction }: Props) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{message}</p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-blue-600 underline"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default ErrorBox;