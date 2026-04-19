import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

// Features
import LoginPage from './features/auth/pages/LoginPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import NewAssessmentPage from './features/assessment/pages/NewAssessmentPage'
import ResultPage from './features/assessment/pages/ResultPage'
import HistoryPage from './features/history/pages/HistoryPage'
import DetailPage from './features/history/pages/DetailPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-assessment" element={<NewAssessmentPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<DetailPage />} />
          
          {/* Fallback to Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
