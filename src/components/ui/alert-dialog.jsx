export function AlertDialog({ children, open, onOpenChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AlertDialogContent({ children, ...props }) {
  return (
    <div
      className="relative bg-white rounded-lg max-w-lg w-full p-6 shadow-lg"
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({ children, ...props }) {
  return <div className="mb-4" {...props}>{children}</div>;
}

export function AlertDialogFooter({ children, ...props }) {
  return (
    <div className="flex justify-end space-x-2 mt-6" {...props}>
      {children}
    </div>
  );
}

export function AlertDialogTitle({ children, ...props }) {
  return (
    <h2 className="text-lg font-semibold text-slate-900" {...props}>
      {children}
    </h2>
  );
}

export function AlertDialogDescription({ children, ...props }) {
  return (
    <p className="text-sm text-slate-500" {...props}>
      {children}
    </p>
  );
}

export function AlertDialogAction({ children, ...props }) {
  return (
    <button
      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      {...props}
    >
      {children}
    </button>
  );
}

export function AlertDialogCancel({ children, ...props }) {
  return (
    <button
      className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      {...props}
    >
      {children}
    </button>
  );
} 