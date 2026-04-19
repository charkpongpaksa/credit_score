'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  name: string
  initials: string
}

interface AppContextType {
  user: User
  history: any[]
  setHistory: React.Dispatch<React.SetStateAction<any[]>>
  currentResult: any | null
  setCurrentResult: (res: any) => void
  saveResult: (res: any) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>({ name: 'Chakphong Paksa', initials: 'CP' })
  const [history, setHistory] = useState<any[]>([])
  const [currentResult, setCurrentResult] = useState<any | null>(null)

  // Load history from localStorage on mount (Client-side)
  useEffect(() => {
    const saved = localStorage.getItem('credit_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse history', e)
      }
    }
  }, [])

  const saveResult = (res: any) => {
    const newHistory = [res, ...history]
    setHistory(newHistory)
    localStorage.setItem('credit_history', JSON.stringify(newHistory))
  }

  return (
    <AppContext.Provider value={{ 
      user, 
      history, 
      setHistory,
      currentResult, 
      setCurrentResult, 
      saveResult 
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
