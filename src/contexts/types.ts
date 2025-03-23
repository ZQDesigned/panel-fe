import { ReactNode } from 'react';

export interface Window {
  id: string;
  appId: number;
  title: string;
  icon: ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isSettings?: boolean;
}

export enum WindowActionType {
  OPEN_WINDOW = 'OPEN_WINDOW',
  CLOSE_WINDOW = 'CLOSE_WINDOW',
  MINIMIZE_WINDOW = 'MINIMIZE_WINDOW',
  MAXIMIZE_WINDOW = 'MAXIMIZE_WINDOW',
  RESTORE_WINDOW = 'RESTORE_WINDOW',
  UPDATE_WINDOW_POSITION = 'UPDATE_WINDOW_POSITION',
  UPDATE_WINDOW_SIZE = 'UPDATE_WINDOW_SIZE',
  FOCUS_WINDOW = 'FOCUS_WINDOW',
}

export type WindowAction =
  | {
      type: WindowActionType.OPEN_WINDOW;
      payload: Omit<Window, 'zIndex' | 'isMinimized' | 'isMaximized'>;
    }
  | {
      type: WindowActionType.CLOSE_WINDOW;
      payload: string;
    }
  | {
      type: WindowActionType.MINIMIZE_WINDOW;
      payload: string;
    }
  | {
      type: WindowActionType.MAXIMIZE_WINDOW;
      payload: string;
    }
  | {
      type: WindowActionType.RESTORE_WINDOW;
      payload: string;
    }
  | {
      type: WindowActionType.UPDATE_WINDOW_POSITION;
      payload: {
        id: string;
        position: { x: number; y: number };
      };
    }
  | {
      type: WindowActionType.UPDATE_WINDOW_SIZE;
      payload: {
        id: string;
        size: { width: number; height: number };
      };
    }
  | {
      type: WindowActionType.FOCUS_WINDOW;
      payload: string;
    };

export interface WindowState {
  windows: Window[];
  activeWindowId: string | null;
  maxZIndex: number;
} 