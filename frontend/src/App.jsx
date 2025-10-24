import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TransactionProvider } from './context/TransactionContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Dashboard from './components/Dashboard/Dashboard'
import TransactionList from './components/Transactions/TransactionList'
import PDFUpload from './components/Transactions/PDFUpload'
import AuthPage from './components/Auth/AuthPage'
import Profile from './components/Profile/Profile'
import './App.css'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [profileOpen, setProfileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  if (!isAuthenticated) {
    return <AuthPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <TransactionList />
      case 'upload':
        return <PDFUpload />
      default:
        return <Dashboard />
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'upload', label: 'Upload PDF', icon: '📄' },
  ]

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">💰</span>
              <h1 className="text-2xl font-bold text-gray-800">SpendWise</h1>
            </div>
          </div>

          <nav className="mt-8 px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white shadow-sm">
            <div className="px-8 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-gray-400 text-sm">Welcome back</h2>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        setCurrentPage('profile')
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>👤</span>
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {currentPage === 'profile' ? <Profile onBack={() => setCurrentPage('dashboard')} /> : renderPage()}
          </main>
        </div>
      </div>
    </TransactionProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
