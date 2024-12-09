export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
} 