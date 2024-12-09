export function Dialog({ children, open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="z-50">{children}</div>
    </div>
  );
}

export function DialogContent({ children, className = "", ...props }) {
  return (
    <div
      className={`relative rounded-lg bg-slate-50 p-6 shadow-lg border border-slate-200 max-w-md w-full mx-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 