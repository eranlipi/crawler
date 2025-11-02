interface Props {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage = ({ message, onClose }: Props) => {
  return (
    <div className="error-message">
      <strong>Error:</strong> {message}
      {onClose && (
        <button onClick={onClose} className="close-btn">
          ×
        </button>
      )}
    </div>
  );
};