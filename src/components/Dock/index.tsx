import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useWindow } from '../../contexts/WindowContext';
import { WindowActionType, Window } from "../../contexts/types";
import ContextMenu from '../ContextMenu';
import AppInfoModal from '../AppInfoModal';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import appConfigs from '../../apps/config';
import {MenuDividerType, MenuItemType} from "antd/es/menu/interface";

const DockContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: ${props => props.isVisible ? '20px' : '-100px'};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: bottom 0.3s ease;
  z-index: 100000;
`;

const DockTrigger = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 99999;
`;

const DockItem = styled.div<{ isActive: boolean; isMinimized: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  opacity: ${props => props.isMinimized ? 0.6 : 1};

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }

  .icon {
    font-size: 24px;
    color: #1a1a1a;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.isMinimized ? '12px' : '4px'};
    height: 4px;
    border-radius: ${props => props.isMinimized ? '2px' : '50%'};
    background: ${props => {
      if (props.isMinimized) return 'rgba(24, 144, 255, 0.5)';
      if (props.isActive) return '#1890ff';
      return 'transparent';
    }};
  }
`;

interface DockProps {
  apps: Array<{ id: number; name: string; icon: React.ReactNode }>;
}

const Dock: React.FC<DockProps> = ({ apps }) => {
  const { state, dispatch } = useWindow();
  const [isVisible, setIsVisible] = useState(true);
  const [mouseInDock, setMouseInDock] = useState(false);
  const [mouseInTrigger, setMouseInTrigger] = useState(false);
  // @ts-ignore
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // 应用信息 Modal 状态
  const [infoModal, setInfoModal] = useState<{
    visible: boolean;
    appId: number | null;
  }>({
    visible: false,
    appId: null,
  });

  // 右键菜单状态
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    appId: number | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    appId: null,
  });

  const hasVisibleMaximizedWindow = state.windows.some(w => w.isMaximized && !w.isMinimized);

  useEffect(() => {
    if (!hasVisibleMaximizedWindow) {
      setIsVisible(true);
      return;
    }

    if (mouseInDock || mouseInTrigger) {
      setIsVisible(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    } else {
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [mouseInDock, mouseInTrigger, hasVisibleMaximizedWindow]);

  const handleAppClick = (app: { id: number; name: string; icon: React.ReactNode }) => {
    const existingWindow = state.windows.find(w => w.appId === app.id);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        dispatch({ type: WindowActionType.RESTORE_WINDOW, payload: existingWindow.id });
      }
      dispatch({ type: WindowActionType.FOCUS_WINDOW, payload: existingWindow.id });
    } else {
      const newWindow: Omit<Window, 'zIndex' | 'isMinimized' | 'isMaximized'> = {
        id: `window-${Date.now()}`,
        appId: app.id,
        title: app.name,
        icon: app.icon,
        position: { x: 0, y: 0 },
        size: { width: window.innerWidth, height: window.innerHeight },
      };
      dispatch({ type: WindowActionType.OPEN_WINDOW, payload: newWindow });
      dispatch({ type: WindowActionType.MAXIMIZE_WINDOW, payload: newWindow.id });
    }
  };

  const handleRestartApp = (app: { id: number; name: string; icon: React.ReactNode }) => {
    const existingWindow = state.windows.find(w => w.appId === app.id);
    if (existingWindow) {
      dispatch({ type: WindowActionType.CLOSE_WINDOW, payload: existingWindow.id });
      // 延迟 1 秒后重新打开应用
      setTimeout(() => {
        handleAppClick(app);
      }, 1000);
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    app: { id: number; name: string; icon: React.ReactNode }
  ) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      appId: app.id,
    });
  };

  const getContextMenuItems = (appId: number): MenuProps['items'] => {
    const existingWindow = state.windows.find(w => w.appId === appId);
    const app = apps.find(a => a.id === appId);
    const appConfig = appConfigs.find(a => a.id === appId);

    if (!app) return [];

    const menuItems: (MenuItemType | MenuDividerType)[] = [
      {
        key: 'status',
        label: existingWindow ? '应用已运行' : '应用未运行',
        icon: existingWindow ? <PlayCircleOutlined /> : <PauseCircleOutlined />,
        disabled: true,
      },
      {
        type: 'divider',
      } as MenuDividerType,
      {
        key: 'open',
        label: existingWindow ? '聚焦窗口' : '打开应用',
        icon: <PlayCircleOutlined />,
        onClick: () => handleAppClick(app),
      },
    ];

    if (existingWindow) {
      menuItems.push(
        {
          key: 'restart',
          label: '重启应用',
          icon: <ReloadOutlined />,
          onClick: () => handleRestartApp(app),
        },
        {
          key: 'close',
          label: '关闭应用',
          icon: <DeleteOutlined />,
          className: 'ant-menu-item-danger',
          onClick: () => {
            dispatch({ type: WindowActionType.CLOSE_WINDOW, payload: existingWindow.id });
          },
        }
      );
    }

    menuItems.push({
      type: 'divider',
    } as MenuDividerType);

    // 仅当应用配置了 settingsComponent 时显示设置选项
    if (appConfig?.settingsComponent) {
      menuItems.push({
        key: 'settings',
        label: '应用设置',
        icon: <SettingOutlined />,
        onClick: () => {
          const settingsWindow: Omit<Window, 'zIndex' | 'isMinimized' | 'isMaximized'> = {
            id: `settings-${Date.now()}`,
            appId: appId,
            title: `${app.name} - 设置`,
            icon: app.icon,
            position: { x: 100, y: 100 },
            size: { width: 600, height: 400 },
            isSettings: true,
          };
          dispatch({ type: WindowActionType.OPEN_WINDOW, payload: settingsWindow });
        },
      });
    }

    // 仅当应用配置了 info 时显示信息选项
    if (appConfig?.info) {
      menuItems.push({
        key: 'info',
        label: '应用信息',
        icon: <InfoCircleOutlined />,
        onClick: () => {
          setInfoModal({
            visible: true,
            appId: appId,
          });
        },
      });
    }

    return menuItems;
  };

  return (
    <>
      {hasVisibleMaximizedWindow && (
        <DockTrigger
          onMouseEnter={() => setMouseInTrigger(true)}
          onMouseLeave={() => setMouseInTrigger(false)}
        />
      )}
      <DockContainer
        isVisible={isVisible}
        onMouseEnter={() => setMouseInDock(true)}
        onMouseLeave={() => setMouseInDock(false)}
      >
        {apps.map(app => {
          const window = state.windows.find(w => w.appId === app.id);
          const isActive = Boolean(window && !window.isMinimized);
          const isMinimized = Boolean(window?.isMinimized);

          return (
            <DockItem
              key={app.id}
              isActive={isActive}
              isMinimized={isMinimized}
              onClick={() => handleAppClick(app)}
              onContextMenu={(e) => handleContextMenu(e, app)}
            >
              <div className="icon">{app.icon}</div>
            </DockItem>
          );
        })}
      </DockContainer>

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={contextMenu.appId ? getContextMenuItems(contextMenu.appId) : []}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
      />

      {infoModal.appId && (
        <AppInfoModal
          visible={infoModal.visible}
          onClose={() => setInfoModal({ visible: false, appId: null })}
          appName={apps.find(a => a.id === infoModal.appId)?.name || ''}
          appIcon={apps.find(a => a.id === infoModal.appId)?.icon}
          info={appConfigs.find(a => a.id === infoModal.appId)?.info}
        />
      )}
    </>
  );
};

export default Dock;
