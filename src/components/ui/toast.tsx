'use client';

import { motion } from 'motion/react';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
} from 'sonner';
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';

export type Variant = 'default' | 'success' | 'error' | 'warning';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface ToastProps {
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  actions?: ActionButton;
  onDismiss?: () => void;
  highlightTitle?: boolean;
}

const variantStyles: Record<Variant, string> = {
  default: 'bg-white border-slate-200 text-slate-900',
  success: 'bg-white border-green-600/50',
  error: 'bg-white border-red-600/50',
  warning: 'bg-white border-amber-600/50',
};

const titleColor: Record<Variant, string> = {
  default: 'text-slate-900',
  success: 'text-green-700',
  error: 'text-red-600',
  warning: 'text-amber-700',
};

const iconColor: Record<Variant, string> = {
  default: 'text-slate-500',
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
};

const variantIcons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation = {
  initial: { opacity: 0, y: -50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -50, scale: 0.95 },
};

/**
 * Utility function to trigger a custom toast globally.
 * Uses sonner's toast.custom to render our animated component.
 */
export function showToast({
  title,
  message,
  variant = 'default',
  duration = 4000,
  actions,
  onDismiss,
  highlightTitle,
}: ToastProps) {
  const Icon = variantIcons[variant];

  sonnerToast.custom(
    (toastId) => (
      <motion.div
        variants={toastAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'flex items-center justify-between w-full p-4 rounded-2xl border shadow-lg ring-1 ring-black/5',
          variantStyles[variant]
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColor[variant])} />
          <div className="space-y-1">
            {title && (
              <h3
                className={cn(
                  'text-sm font-semibold leading-none',
                  titleColor[variant],
                  highlightTitle && titleColor['success']
                )}
              >
                {title}
              </h3>
            )}
            <p className="text-sm text-slate-600 font-medium">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-4">
          {actions?.label && (
            <button
              onClick={() => {
                actions.onClick();
                sonnerToast.dismiss(toastId);
              }}
              className={cn(
                'cursor-pointer px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border',
                variant === 'success'
                  ? 'text-green-700 border-green-600/30 hover:bg-green-50'
                  : variant === 'error'
                  ? 'text-red-700 border-red-600/30 hover:bg-red-50'
                  : variant === 'warning'
                  ? 'text-amber-700 border-amber-600/30 hover:bg-amber-50'
                  : 'text-slate-700 border-slate-300 hover:bg-slate-100'
              )}
            >
              {actions.label}
            </button>
          )}

          <button
            onClick={() => {
              sonnerToast.dismiss(toastId);
              onDismiss?.();
            }}
            className="rounded-full p-1.5 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </motion.div>
    ),
    { duration }
  );
}

/**
 * Global toaster provider. Mount this once in the root layout.
 */
export function GlobalToaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{ 
        unstyled: true, 
        className: 'w-full sm:w-[400px]',
      }}
    />
  );
}
