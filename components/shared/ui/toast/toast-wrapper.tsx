'use client'

import * as React from "react"
import { Toast, ToastProvider, ToastPrimitive, useToast } from "./index"

// Global Toast Context
const ToastContext = React.createContext<ReturnType<typeof useToast> | undefined>(undefined)

// Toast Context Provider Component
export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
  const toastHook = useToast()

  return (
    <ToastProvider>
      <ToastContext.Provider value={toastHook}>
        {children}
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
  return context
}

// Utility hook for showing toasts
export const useShowToast = () => {
  const toastContext = React.useContext(ToastContext)
  
  const showToast = React.useCallback((
    type: 'default' | 'success' | 'error' | 'warning' | 'info', 
    title: string, 
    description?: string
  ) => {
    if (toastContext) {
      toastContext.toast({
        variant: type,
        title,
        description,
      })
    }
  }, [toastContext])

  return showToast
}

export { Toast, ToastProvider, ToastPrimitive }
