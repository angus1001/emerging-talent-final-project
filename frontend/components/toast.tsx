import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <Alert className={`mb-2 ${toast.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {toast.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600 mr-2" />
          )}
          <AlertDescription className={toast.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {toast.message}
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClose(toast.id)}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Alert>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string) => {
    addToast({ type: 'success', message });
  };

  const showError = (message: string) => {
    addToast({ type: 'error', message });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
  };
}
