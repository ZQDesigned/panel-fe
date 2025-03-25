import React from 'react';
import styled from '@emotion/styled';
import {Layout} from 'antd';
import {WindowProvider} from '../contexts/WindowContext';
import WindowManager from '../components/WindowManager';
import Dock from '../components/Dock';
import LeftSidebar from '../components/LeftSidebar';
import AppPanel from '../components/AppPanel';
import RightSidebar from '../components/RightSidebar';
import appConfigs from '../apps/config';

const {Content} = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const BackgroundWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
    background-image: url('https://www.loliapi.cn/acg/');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.3),
                rgba(255, 255, 255, 0.5)
        );
        backdrop-filter: blur(2px);
    }
`;

const ContentWrapper = styled(Content)`
  display: flex;
  margin: 24px;
  gap: 24px;
  max-width: 100%;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 12px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  max-width: 1200px;
  display: flex;
  gap: 24px;
`;

const WindowsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  > * {
    pointer-events: auto;
  }
`;

const MainLayout: React.FC = () => {
    return (
        <WindowProvider>
            <StyledLayout>
                <BackgroundWrapper/>
                <ContentWrapper>
                    <MainContent>
                        <LeftSidebar/>
                        <AppPanel/>
                    </MainContent>
                    <RightSidebar/>
                </ContentWrapper>
                <WindowsContainer>
                    <WindowManager/>
                </WindowsContainer>
                <Dock apps={appConfigs}/>
            </StyledLayout>
        </WindowProvider>
    );
};

export default MainLayout;
