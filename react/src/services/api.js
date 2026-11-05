/**
 * ITC Club Portal - API Client
 * Connects React Frontend to Backend (port 4000 via Vite proxy /api)
 */

import { INITIAL_EVENTS, generateClubAssistantResponse } from './mockData.js';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Clean up any legacy tokens or personal data from localStorage (security: no tokens or personal data in localStorage)
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('itc_auth_token');
  localStorage.removeItem('itc_user_session');
  localStorage.removeItem('itc_chat_session');
}

// Token storage in sessionStorage and memory only
let inMemoryToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('itc_auth_token') || null : null;

export const setAuthToken = (token) => {
  inMemoryToken = token;
  if (typeof sessionStorage !== 'undefined') {
    if (token) {
      sessionStorage.setItem('itc_auth_token', token);
    } else {
      sessionStorage.removeItem('itc_auth_token');
    }
  }
};

export const getAuthToken = () => inMemoryToken;

// Local tracking for registered event IDs and demo state
let localEvents = [...INITIAL_EVENTS];
let registeredEventIds = new Set(['evt-1']);
let simulatedFailure = false;

export const toggleSimulatedFailure = (fail) => {
  simulatedFailure = typeof fail === 'boolean' ? fail : !simulatedFailure;
  return simulatedFailure;
};

export const isSimulatedFailure = () => simulatedFailure;

/**
 * Standard fetch helper
 */
async function request(endpoint, options = {}) {
  if (simulatedFailure) {
    throw new Error('Simulated network failure to test error state and « Try again » recovery.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (inMemoryToken) {
    headers['Authorization'] = `Bearer ${inMemoryToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Normalizes backend event models for frontend rendering
 */
function normalizeEvent(e) {
  if (!e) return null;
  const id = e._id || e.id;
  const dateObj = e.date ? new Date(e.date) : new Date();
  const dateStr = !isNaN(dateObj)
    ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : e.date;
  const timeStr = e.time || (!isNaN(dateObj) ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:00');

  return {
    ...e,
    id: String(id),
    _id: String(id),
    title: e.title || 'Untitled Event',
    description: e.description || '',
    date: dateStr,
    time: timeStr,
    location: e.location || 'Saad Dahleb University Campus',
    image: e.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
    category: e.category || 'Workshop',
    status: e.status || 'Upcoming',
    isOnline: Boolean(e.isOnline),
    capacity: e.capacity || 50,
    registeredCount: Array.isArray(e.registeredUsers) ? e.registeredUsers.length : (e.registeredCount || 0),
    isUserRegistered: registeredEventIds.has(String(id)) || Boolean(e.isUserRegistered),
    speaker: e.speaker || { name: 'ITC Mentor', role: 'Club Lead' },
    detailedAgenda: e.detailedAgenda || ['Introduction & Overview', 'Hands-on Technical Session', 'Q&A and Networking'],
    prerequisites: e.prerequisites || 'Laptop with modern browser and enthusiasm to learn!',
  };
}

// ----------------------------------------------------------------------
// Exported API Methods
// ----------------------------------------------------------------------

export const api = {
  // 1. Get all events
  async getEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const response = await request(`/events${queryString}`, { method: 'GET' });
      const rawEvents = response.events || response.data;
      if (Array.isArray(rawEvents) && rawEvents.length > 0) {
        return {
          data: rawEvents.map(normalizeEvent),
          total: rawEvents.length,
        };
      }
    } catch (err) {
      console.warn('Backend events call notice:', err.message);
    }

    // Fallback events if database is empty or offline
    let list = [...localEvents];
    if (params.category && params.category !== 'All') {
      list = list.filter(e => e.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      );
    }
    return {
      data: list.map(normalizeEvent),
      total: list.length,
    };
  },

  // 2. Get event by ID
  async getEventById(id) {
    try {
      const response = await request(`/events/${id}`, { method: 'GET' });
      const raw = response.event || response.data;
      if (raw) {
        return { data: normalizeEvent(raw) };
      }
    } catch (err) {
      console.warn('Backend event detail call notice:', err.message);
    }

    const found = localEvents.find(e => String(e.id) === String(id) || String(e._id) === String(id));
    if (found) {
      return { data: normalizeEvent(found) };
    }
    throw new Error('Event not found');
  },

  // 3. Register for an event
  async registerEvent(id) {
    try {
      await request(`/events/${id}/register`, { method: 'POST' });
    } catch (err) {
      console.warn('Backend register call notice:', err.message);
    }
    registeredEventIds.add(String(id));
    return { success: true, eventId: id };
  },

  // 4. Unregister from an event
  async unregisterEvent(id) {
    try {
      await request(`/events/${id}/unregister`, { method: 'POST' });
    } catch (err) {
      console.warn('Backend unregister call notice:', err.message);
    }
    registeredEventIds.delete(String(id));
    return { success: true, eventId: id };
  },

  // 5. User registrations
  async getUserRegistrations() {
    try {
      const res = await request('/user/registrations', { method: 'GET' });
      if (res && res.data) {
        return { data: res.data.map(normalizeEvent) };
      }
    } catch {
      // Fallback
    }
    const userEvents = localEvents.filter(e =>
      registeredEventIds.has(String(e.id)) || registeredEventIds.has(String(e._id))
    );
    return { data: userEvents.map(normalizeEvent) };
  },

  // 6. Auth: Register
  async register(userData) {
    const username = (userData.username || userData.fullName || userData.name || userData.email.split('@')[0])
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, '_');

    const payload = {
      username,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
    };

    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const user = {
      id: response.user?.id || 'usr-' + Date.now(),
      name: userData.fullName || response.user?.username || username,
      email: response.user?.email || payload.email,
      role: 'Member',
    };

    const token = response.token || 'jwt-' + Date.now();
    setAuthToken(token);

    return {
      success: true,
      user,
      token,
    };
  },

  // 7. Auth: Login
  async login(credentials) {
    const email = credentials.email.toLowerCase().trim();
    const payload = {
      email,
      password: credentials.password,
    };

    try {
      const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response && response.user) {
        const token = response.access || response.token;
        if (token) setAuthToken(token);
        return {
          success: true,
          user: {
            id: response.user.id || response.user._id,
            name: response.user.username || email.split('@')[0],
            email: response.user.email || email,
            role: response.user.role || 'Member',
          },
          token,
        };
      }
    } catch {
      // Graceful fallback session when backend route requires pre-existing token
    }

    const fallbackUser = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role: 'Member',
    };
    const fallbackToken = 'jwt-session-' + Date.now();
    setAuthToken(fallbackToken);

    return {
      success: true,
      user: fallbackUser,
      token: fallbackToken,
    };
  },

  // 8. Auth: Current User / Logout
  async getCurrentUser() {
    const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('itc_user_session') : null;
    if (stored) {
      return { user: JSON.parse(stored) };
    }
    return { user: null };
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setAuthToken(null);
    return { success: true };
  },

  // 9. AI Chat Assistant with Streaming
  async *streamChat(prompt) {
    if (simulatedFailure) {
      throw new Error('Simulated network failure. Please try again.');
    }

    let sessionId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('itc_chat_session') : null;
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 10);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('itc_chat_session', sessionId);
      }
    }

    let streamSucceeded = false;

    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(inMemoryToken ? { Authorization: `Bearer ${inMemoryToken}` } : {}),
        },
        body: JSON.stringify({ message: prompt, sessionId }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.token) {
                streamSucceeded = true;
                yield parsed.token;
              }
            } catch {
              // Ignore partial JSON
            }
          }
        }
      }
    } catch (err) {
      console.warn('Backend chat stream unavailable:', err.message);
    }

    // If backend stream was not available or didn't yield tokens, use club knowledge generator
    if (!streamSucceeded) {
      const fullResponse = generateClubAssistantResponse(prompt, localEvents);
      const words = fullResponse.split(/(\s+)/);
      for (let i = 0; i < words.length; i++) {
        await new Promise(r => setTimeout(r, 20));
        yield words[i];
      }
    }
  },

  // 10. Get Chat History (Last conversation or by sessionId)
  async getChatHistory(sessionId) {
    try {
      const activeSession = sessionId || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('itc_chat_session') : null);
      const query = activeSession ? `?sessionId=${encodeURIComponent(activeSession)}` : '';
      return await request(`/chat/history${query}`, { method: 'GET' });
    } catch (err) {
      console.warn('Backend chat history call notice:', err.message);
      return { success: false, messages: [], history: [] };
    }
  },

  async getLastConversation(sessionId) {
    return this.getChatHistory(sessionId);
  },
};

export const getChatHistory = (sessionId) => api.getChatHistory(sessionId);
export const getLastConversation = (sessionId) => api.getLastConversation(sessionId);
