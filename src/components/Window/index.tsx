import React, {Suspense, useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';
import {CloseOutlined, ExpandOutlined, MinusOutlined} from '@ant-design/icons';
import type {Window as WindowType} from '../../contexts/types';
import {WindowActionType} from '../../contexts/types';
import {useWindow} from '../../contexts/WindowContext';
import appConfigs from '../../apps/config';
import ErrorBoundary from '../ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner';

interface WindowProps {
    window: WindowType;
}

const WindowContainer = styled.div<{
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMaximized: boolean;
    isClosing: boolean;
    isMinimizing: boolean;
    isDragging: boolean;
    isResizing: boolean;
    isOpening: boolean;
}>`
    position: fixed;
    left: 0;
    top: 0;
    width: ${props => props.isMaximized ? '100vw' : `${props.width}px`};
    height: ${props => props.isMaximized ? '100vh' : `${props.height}px`};
    transform: ${props => props.isMaximized ? 'none' : `translate3d(${props.x}px, ${props.y}px, 0)`};
    background: rgba(255, 255, 255, 0.9);
    border-radius: ${props => props.isMaximized ? 0 : '8px'};
    box-shadow: ${props => props.isMaximized ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.15)'};
    display: flex;
    flex-direction: column;
    z-index: ${props => props.zIndex};
    transition: ${props => {
        if (props.isDragging || props.isResizing) return 'none';
        return 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }};
    overflow: hidden;
    will-change: transform;

    /* 浮入浮出动画 */
    animation: ${props => {
        if (props.isClosing) return 'windowOut';
        if (props.isMinimizing) return 'windowOut';
        if (props.isOpening) return 'windowIn';
        return 'none';
    }} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center center;

    @keyframes windowIn {
        from {
            opacity: 0;
            transform: translate3d(${props => props.x}px, ${props => props.y + 20}px, 0) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate3d(${props => props.x}px, ${props => props.y}px, 0) scale(1);
        }
    }

    @keyframes windowOut {
        from {
            opacity: 1;
            transform: translate3d(${props => props.x}px, ${props => props.y}px, 0) scale(1);
        }
        to {
            opacity: 0;
            transform: translate3d(${props => props.x}px, ${props => props.y + 20}px, 0) scale(0.8);
        }
    }
`;

const WindowHeader = styled.div<{ isMaximized: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #f0f0f0;
  border-radius: ${props => props.isMaximized ? 0 : '8px 8px 0 0'};
  cursor: move;
  user-select: none;

  .title {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1a1a1a;
    
    .icon {
      color: #1890ff;
    }
  }
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;

  .control-button {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
      color: #1a1a1a;
    }
  }
`;

const WindowContent = styled.div`
  flex: 1;
  overflow: hidden;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  display: flex;
  flex-direction: column;
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: transparent;
  cursor: nwse-resize;
  right: 0;
  bottom: 0;
`;

const Window: React.FC<WindowProps> = ({window: windowData}) => {
    const {dispatch} = useWindow();
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isMinimizing, setIsMinimizing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isOpening, setIsOpening] = useState(true);
    const [previousState, setPreviousState] = useState<{
        position: { x: number; y: number };
        size: { width: number; height: number };
    } | null>(null);

    // 使用 useRef 存储拖拽状态，避免重渲染
    const dragState = useRef({
        isDragging: false,
        isResizing: false,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startLeft: 0,
        startTop: 0,
    });

    useEffect(() => {
        const container = containerRef.current;
        const header = headerRef.current;
        const resizeHandle = resizeRef.current;
        if (!container || !header || !resizeHandle) return;

        const handleMouseDown = (e: MouseEvent, mode: 'drag' | 'resize') => {
            if (windowData.isMaximized) return;

            if (mode === 'drag') {
                dragState.current.isDragging = true;
                setIsDragging(true);
            } else {
                dragState.current.isResizing = true;
                setIsResizing(true);
            }

            dragState.current.startX = e.clientX;
            dragState.current.startY = e.clientY;
            const rect = container.getBoundingClientRect();
            dragState.current.startWidth = rect.width;
            dragState.current.startHeight = rect.height;
            dragState.current.startLeft = windowData.position.x;
            dragState.current.startTop = windowData.position.y;

            dispatch({type: WindowActionType.FOCUS_WINDOW, payload: windowData.id});
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragState.current.isDragging && !dragState.current.isResizing) return;

            requestAnimationFrame(() => {
                if (dragState.current.isDragging) {
                    const deltaX = e.clientX - dragState.current.startX;
                    const deltaY = e.clientY - dragState.current.startY;

                    dispatch({
                        type: WindowActionType.UPDATE_WINDOW_POSITION,
                        payload: {
                            id: windowData.id,
                            position: {
                                x: dragState.current.startLeft + deltaX,
                                y: dragState.current.startTop + deltaY,
                            },
                        },
                    });
                }

                if (dragState.current.isResizing) {
                    const deltaX = e.clientX - dragState.current.startX;
                    const deltaY = e.clientY - dragState.current.startY;

                    dispatch({
                        type: WindowActionType.UPDATE_WINDOW_SIZE,
                        payload: {
                            id: windowData.id,
                            size: {
                                width: Math.max(400, dragState.current.startWidth + deltaX),
                                height: Math.max(300, dragState.current.startHeight + deltaY),
                            },
                        },
                    });
                }
            });
        };

        const handleMouseUp = () => {
            dragState.current.isDragging = false;
            dragState.current.isResizing = false;
            setIsDragging(false);
            setIsResizing(false);
        };

        const handleHeaderMouseDown = (e: MouseEvent) => handleMouseDown(e, 'drag');
        const handleResizeMouseDown = (e: MouseEvent) => handleMouseDown(e, 'resize');

        header.addEventListener('mousedown', handleHeaderMouseDown);
        resizeHandle.addEventListener('mousedown', handleResizeMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            header.removeEventListener('mousedown', handleHeaderMouseDown);
            resizeHandle.removeEventListener('mousedown', handleResizeMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [windowData.id, windowData.isMaximized, dispatch, windowData.position.x, windowData.position.y]);

    // 窗口打开动画结束后，重置 isOpening 状态
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpening(false);
        }, 300); // 动画持续时间

        return () => clearTimeout(timer);
    }, []);

    const handleMaximizeClick = () => {
        if (windowData.isMaximized) {
            if (previousState) {
                dispatch({
                    type: WindowActionType.UPDATE_WINDOW_POSITION,
                    payload: {
                        id: windowData.id,
                        position: previousState.position,
                    },
                });
                dispatch({
                    type: WindowActionType.UPDATE_WINDOW_SIZE,
                    payload: {
                        id: windowData.id,
                        size: previousState.size,
                    },
                });
            } else {
                const defaultWidth = Math.min(1200, window.innerWidth * 0.8);
                const defaultHeight = Math.min(800, window.innerHeight * 0.8);
                dispatch({
                    type: WindowActionType.UPDATE_WINDOW_POSITION,
                    payload: {
                        id: windowData.id,
                        position: {
                            x: (window.innerWidth - defaultWidth) / 2,
                            y: (window.innerHeight - defaultHeight) / 2,
                        },
                    },
                });
                dispatch({
                    type: WindowActionType.UPDATE_WINDOW_SIZE,
                    payload: {
                        id: windowData.id,
                        size: {
                            width: defaultWidth,
                            height: defaultHeight,
                        },
                    },
                });
            }
            dispatch({type: WindowActionType.RESTORE_WINDOW, payload: windowData.id});
        } else {
            setPreviousState({
                position: windowData.position,
                size: windowData.size,
            });
            dispatch({type: WindowActionType.MAXIMIZE_WINDOW, payload: windowData.id});
        }
    };

    const handleHeaderDoubleClick = (e: React.MouseEvent) => {
        // 只有点击标题栏区域才触发全屏切换，点击控制按钮区域不触发
        if ((e.target as HTMLElement).closest('.control-button')) {
            return;
        }
        handleMaximizeClick();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            dispatch({type: WindowActionType.CLOSE_WINDOW, payload: windowData.id});
        }, 300);
    };

    const handleMinimize = () => {
        setIsMinimizing(true);
        setTimeout(() => {
            dispatch({type: WindowActionType.MINIMIZE_WINDOW, payload: windowData.id});
            setIsMinimizing(false);
        }, 300);
    };

    // 获取当前应用的配置
    const appConfig = appConfigs.find(app => app.id === windowData.appId);
    const AppComponent = windowData.isSettings ? appConfig?.settingsComponent : appConfig?.component;

    return (
        <WindowContainer
            ref={containerRef}
            x={windowData.position.x}
            y={windowData.position.y}
            width={windowData.size.width}
            height={windowData.size.height}
            zIndex={windowData.zIndex}
            isMaximized={windowData.isMaximized}
            isClosing={isClosing}
            isMinimizing={isMinimizing}
            isDragging={isDragging}
            isResizing={isResizing}
            isOpening={isOpening}
        >
            <WindowHeader
                ref={headerRef}
                isMaximized={windowData.isMaximized}
                onDoubleClick={handleHeaderDoubleClick}
            >
                <div className="title">
                    <span className="icon">{windowData.icon}</span>
                    <span>{windowData.title}</span>
                </div>
                <WindowControls>
                    <div
                        className="control-button"
                        onClick={handleMinimize}
                    >
                        <MinusOutlined/>
                    </div>
                    <div
                        className="control-button"
                        onClick={handleMaximizeClick}
                    >
                        <ExpandOutlined/>
                    </div>
                    <div
                        className="control-button"
                        onClick={handleClose}
                    >
                        <CloseOutlined/>
                    </div>
                </WindowControls>
            </WindowHeader>
            <WindowContent>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner/>}>
                        {AppComponent ? (
                            <AppComponent windowId={windowData.id}/>
                        ) : (
                            <div>
                                <h2>应用{windowData.isSettings ? '设置' : ''}加载失败</h2>
                                <p>无法找到对应的{windowData.isSettings ? '设置' : '应用'}组件</p>
                            </div>
                        )}
                    </Suspense>
                </ErrorBoundary>
            </WindowContent>
            {!windowData.isMaximized && <ResizeHandle ref={resizeRef}/>}
        </WindowContainer>
    );
};

export default Window;
