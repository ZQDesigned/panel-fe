import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Window, WindowState, WindowAction, WindowActionType } from './types';

const initialState: WindowState = {
  windows: [],
  activeWindowId: null,
  maxZIndex: 0,
};

function windowReducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case WindowActionType.OPEN_WINDOW: {
      const newZIndex = state.maxZIndex + 1;
      const newWindow: Window = {
        ...action.payload,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZIndex,
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: newWindow.id,
        maxZIndex: newZIndex,
      };
    }
    case WindowActionType.CLOSE_WINDOW:
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload),
        activeWindowId: state.activeWindowId === action.payload ? null : state.activeWindowId,
      };
    case WindowActionType.MINIMIZE_WINDOW:
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMinimized: true } : w
        ),
      };
    case WindowActionType.MAXIMIZE_WINDOW:
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMaximized: true } : w
        ),
      };
    case WindowActionType.RESTORE_WINDOW:
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMinimized: false, isMaximized: false } : w
        ),
      };
    case WindowActionType.UPDATE_WINDOW_POSITION:
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, position: action.payload.position } : w
        ),
      };
    case WindowActionType.UPDATE_WINDOW_SIZE:
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, size: action.payload.size } : w
        ),
      };
    case WindowActionType.FOCUS_WINDOW: {
      const newZIndex = state.maxZIndex + 1;
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, zIndex: newZIndex } : w
        ),
        activeWindowId: action.payload,
        maxZIndex: newZIndex,
      };
    }
    default:
      return state;
  }
}

const WindowContext = createContext<{
  state: WindowState;
  dispatch: React.Dispatch<WindowAction>;
} | null>(null);

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(windowReducer, initialState);

  return (
    <WindowContext.Provider value={{ state, dispatch }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider');
  }
  return context;
};
