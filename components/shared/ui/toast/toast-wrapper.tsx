'use client'

import * as React from "react"
import { Toast, ToastProvider, useToast } from "./index"

// Global Toast Context
const ToastContext = React.createContext<ReturnType<typeof useToast> | undefined>(undefined)

// Toast Context Provider Component
export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
  const toastHook = useToast()

  return (
    <ToastProvider>
      <ToastContext.Provider value={toastHook}>
        {children}
        <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
          {toastHook.toasts.map((toastProps) => (
            <Toast 
              key={toastProps.id} 
              {...toastProps} 
              onOpenChange={(open) => {
                if (!open) {
                  toastHook.dismiss(toastProps.id)
                }
              }}
            />
          ))}
        </div>
      </ToastContext.Provider>
    </ToastProvider>
  )
}

// Custom hook to use toast in components
export const useCustomToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useCustomToast must be used within a ToastContextProvider")
  }

  return {
    toast: (props: { title: string; description?: string; variant?: 'success' | 'error' | 'warning' | 'info' | 'default' }) => {
      return context.toast({
        title: props.title,
        description: props.description,
        variant: props.variant || 'default'
      })
    }
  }
}

export { Toast, ToastProvider }
