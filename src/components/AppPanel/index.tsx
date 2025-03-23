import React from 'react';
import styled from '@emotion/styled';
import { Card } from 'antd';
import { useWindow } from '../../contexts/WindowContext';
import { WindowActionType } from '../../contexts/types';
import type { Window } from '../../contexts/types';
import appConfigs from '../../apps/config';

const PanelWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
`;

const AppCard = styled(Card)`
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .ant-card-body {
    padding: 16px 8px;
  }

  .icon-wrapper {
    font-size: 24px;
    margin-bottom: 8px;
    color: #1890ff;
  }

  .app-name {
    font-size: 12px;
    color: #333;
    margin: 0;
  }
`;

const AppPanel: React.FC = () => {
  const { state, dispatch } = useWindow();

  const handleAppClick = (app: { id: number; name: string; icon: React.ReactNode }) => {
    const existingWindow = state.windows.find(w => w.appId === app.id);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        dispatch({ type: WindowActionType.RESTORE_WINDOW, payload: existingWindow.id });
      }
      dispatch({ type: WindowActionType.FOCUS_WINDOW, payload: existingWindow.id });
    } else {
      const defaultWidth = Math.min(1200, window.innerWidth * 0.8);
      const defaultHeight = Math.min(800, window.innerHeight * 0.8);
      
      const newWindow: Omit<Window, 'zIndex' | 'isMinimized' | 'isMaximized'> = {
        id: `window-${Date.now()}`,
        appId: app.id,
        title: app.name,
        icon: app.icon,
        position: {
          x: (window.innerWidth - defaultWidth) / 2,
          y: (window.innerHeight - defaultHeight) / 2,
        },
        size: {
          width: defaultWidth,
          height: defaultHeight,
        },
      };
      
      dispatch({ type: WindowActionType.OPEN_WINDOW, payload: newWindow });
    }
  };

  return (
    <PanelWrapper>
      <GridContainer>
        {appConfigs.map((app) => (
          <AppCard
            key={app.id}
            bordered={false}
            onClick={() => handleAppClick(app)}
          >
            <div className="icon-wrapper">{app.icon}</div>
            <p className="app-name">{app.name}</p>
          </AppCard>
        ))}
      </GridContainer>
    </PanelWrapper>
  );
};

export default AppPanel;
