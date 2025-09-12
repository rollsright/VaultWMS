import React from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { Cross2Icon } from '@radix-ui/react-icons'

interface ToastProps {
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Toast({ title, description, type = 'info', open, onOpenChange }: ToastProps) {
  const typeStyles = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800'
  }

  return (
    <RadixToast.Root
      className={`
        fixed bottom-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-sm
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full
        data-[state=open]:slide-in-from-right-full data-[state=open]:fade-in-0
        ${typeStyles[type]}
      `}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <RadixToast.Title className="font-medium mb-1">
              {title}
            </RadixToast.Title>
          )}
          {description && (
            <RadixToast.Description className="text-sm opacity-90">
              {description}
            </RadixToast.Description>
          )}
        </div>
        <RadixToast.Close className="ml-2 opacity-70 hover:opacity-100">
          <Cross2Icon className="h-4 w-4" />
        </RadixToast.Close>
      </div>
    </RadixToast.Root>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <RadixToast.Provider>
      {children}
      <RadixToast.Viewport />
    </RadixToast.Provider>
  )
}
