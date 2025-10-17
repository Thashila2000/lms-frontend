export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed z-50 flex items-center gap-2 px-4 py-2 text-white bg-gray-800 rounded shadow-lg bottom-4 right-4">
      <span>{message}</span>
      <button onClick={onClose} className="text-lg font-bold text-white hover:text-red-400">✖</button>
    </div>
  );
}