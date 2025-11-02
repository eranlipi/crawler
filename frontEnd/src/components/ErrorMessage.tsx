interface Props {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage = ({ message, onDismiss }: Props) => {
  return (
    <div className="py-4 px-4 bg-red-50 border-l-4 border-red-500 my-5 rounded-lg relative text-red-800 text-sm">
      <strong className="font-semibold">Error:</strong> {message}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 bg-transparent text-red-500 text-xl p-0 w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:bg-red-100"
        >
          ×
        </button>
      )}
    </div>
  );
};
