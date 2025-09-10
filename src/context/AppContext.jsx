import { createContext, useContext, useEffect, useReducer } from "react";

// API Service
const API_BASE_URL = "https://kko-backend.adityakumar.live";

export const apiService = {
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  async chatWithDocument(mongoId, question) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mongo_id: mongoId,
        question: question,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.statusText}`);
    }

    return response.json();
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.text();
  },
};

// Context for global state management
const AppContext = createContext();

// Action types
const ACTION_TYPES = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
  ADD_DOCUMENT: "ADD_DOCUMENT",
  SET_CURRENT_DOCUMENT: "SET_CURRENT_DOCUMENT",
  ADD_CHAT_MESSAGE: "ADD_CHAT_MESSAGE",
  SET_THEME: "SET_THEME",
  SET_LANGUAGE: "SET_LANGUAGE", // ✅ new
  SET_SIDEBAR_OPEN: "SET_SIDEBAR_OPEN",
  UPDATE_ANALYTICS: "UPDATE_ANALYTICS",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  success: null,
  documents: [],
  currentDocument: null,
  chatMessages: [],
  theme: "dark",
  language: "en", // ✅ default language
  sidebarOpen: false,
  analytics: {
    totalDocuments: 0,
    totalQuestions: 0,
    avgProcessingTime: 0,
    departmentBreakdown: {},
    recentActivity: [],
  },
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTION_TYPES.SET_SUCCESS:
      return { ...state, success: action.payload, loading: false, error: null };
    case ACTION_TYPES.ADD_DOCUMENT:
      return {
        ...state,
        documents: [...state.documents, action.payload],
        analytics: {
          ...state.analytics,
          totalDocuments: state.analytics.totalDocuments + 1,
          recentActivity: [
            {
              type: "upload",
              document: action.payload.filename,
              timestamp: new Date().toISOString(),
            },
            ...state.analytics.recentActivity.slice(0, 9),
          ],
        },
      };
    case ACTION_TYPES.SET_CURRENT_DOCUMENT:
      return { ...state, currentDocument: action.payload };
    case ACTION_TYPES.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
        analytics: {
          ...state.analytics,
          totalQuestions:
            state.analytics.totalQuestions +
            (action.payload.type === "user" ? 1 : 0),
        },
      };
    case ACTION_TYPES.SET_THEME:
      return { ...state, theme: action.payload };
    case ACTION_TYPES.SET_LANGUAGE: // ✅ new
      return { ...state, language: action.payload };
    case ACTION_TYPES.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };
    case ACTION_TYPES.UPDATE_ANALYTICS:
      return { ...state, analytics: { ...state.analytics, ...action.payload } };
    case ACTION_TYPES.CLEAR_MESSAGES:
      return { ...state, chatMessages: [] };
    default:
      return state;
  }
}

// Context Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    dispatch({ type: ACTION_TYPES.SET_THEME, payload: savedTheme });

    // Apply theme to document
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("theme", state.theme);
    if (state.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.theme]);

  // Actions
  const actions = {
    setLoading: (loading) =>
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) =>
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
    setSuccess: (message) =>
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: message }),
    addDocument: (document) =>
      dispatch({ type: ACTION_TYPES.ADD_DOCUMENT, payload: document }),
    setCurrentDocument: (document) =>
      dispatch({ type: ACTION_TYPES.SET_CURRENT_DOCUMENT, payload: document }),
    addChatMessage: (message) =>
      dispatch({ type: ACTION_TYPES.ADD_CHAT_MESSAGE, payload: message }),
    toggleTheme: () =>
      dispatch({
        type: ACTION_TYPES.SET_THEME,
        payload: state.theme === "dark" ? "light" : "dark",
      }),
    setLanguage: (lang) =>
      dispatch({ type: ACTION_TYPES.SET_LANGUAGE, payload: lang }), // ✅
    setSidebarOpen: (open) =>
      dispatch({ type: ACTION_TYPES.SET_SIDEBAR_OPEN, payload: open }),
    updateAnalytics: (data) =>
      dispatch({ type: ACTION_TYPES.UPDATE_ANALYTICS, payload: data }),
    clearMessages: () => dispatch({ type: ACTION_TYPES.CLEAR_MESSAGES }),

    // API Actions
    uploadDocument: async (file) => {
      try {
        actions.setLoading(true);
        const result = await apiService.uploadDocument(file);
        actions.addDocument(result);
        actions.setSuccess("Document uploaded successfully!");
        return result;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      }
    },

    askQuestion: async (question) => {
      if (!state.currentDocument?.mongo_id) {
        actions.setError("No document selected");
        return;
      }

      try {
        actions.setLoading(true);
        actions.addChatMessage({
          type: "user",
          content: question,
          timestamp: new Date().toISOString(),
        });

        const result = await apiService.chatWithDocument(
          state.currentDocument.mongo_id,
          question
        );
        actions.addChatMessage({
          type: "assistant",
          content: result.answer,
          timestamp: new Date().toISOString(),
        });

        actions.setLoading(false);
        return result;
      } catch (error) {
        actions.setError(error.message);
        actions.addChatMessage({
          type: "error",
          content: "Failed to get response",
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
