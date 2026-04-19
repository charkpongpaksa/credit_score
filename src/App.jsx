import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NewAssessmentPage from './pages/NewAssessmentPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import DetailPage from './pages/DetailPage'

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
          {/* Catch-all → Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
