import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import ChatWidget from './components/chat/ChatWidget.jsx';
import DevTools from './components/common/DevTools.jsx';
import LoadingSkeleton from './components/common/LoadingSkeleton.jsx';

import './App.css';

// Lazy-load routes for code-splitting and faster initial page loads
const Home = React.lazy(() => import('./pages/Home.jsx'));
const EventsPage = React.lazy(() => import('./pages/EventsPage.jsx'));
const EventDetailPage = React.lazy(() => import('./pages/EventDetailPage.jsx'));
const AuthPage = React.lazy(() => import('./pages/AuthPage.jsx'));
const ChatPage = React.lazy(() => import('./pages/ChatPage.jsx'));
const MyEventsPage = React.lazy(() => import('./pages/MyEventsPage.jsx'));

// Configure TanStack Query client with 60s staleTime for instant back navigation
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 60 seconds fresh: no refetch on page navigation
      gcTime: 5 * 60_000, // 5 minutes garbage collection
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="container" style={{ padding: '3rem 1.5rem' }}>
    <LoadingSkeleton count={3} />
  </div>
);

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-layout">
            {/* Global Accessible Navbar */}
            <Navbar />

            {/* Main Application Pages with Route Lazy-Loading */}
            <main className="main-content" id="main-content" tabIndex="-1">
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/login" element={<AuthPage initialMode="login" />} />
                  <Route path="/register" element={<AuthPage initialMode="register" />} />
                  <Route path="/chat" element={<ChatPage />} />

                  {/* Protected Private Route for Authenticated Members */}
                  <Route
                    path="/my-events"
                    element={
                      <ProtectedRoute>
                        <MyEventsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch All */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>

            {/* Global Footer */}
            <Footer />

            {/* Global Floating AI Chat Widget */}
            <ChatWidget />

            {/* State & API 3-State Testing Toolbar */}
            <DevTools />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
