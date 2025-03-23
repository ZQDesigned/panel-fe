import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

const StyledMenuWrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  z-index: 1000000;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'scale(1)' : 'scale(0.95)'};
  transition: opacity 0.2s, transform 0.2s;
  transform-origin: top left;
`;

const StyledMenu = styled(Menu)`
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(12px);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .ant-dropdown-menu-item {
    padding: 8px 16px;
    
    &:hover {
      background: rgba(24, 144, 255, 0.1);
    }
  }
`;

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  items: MenuProps['items'];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  items,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<{
    left: number;
    top: number;
    opacity: number;
  }>({
    left: x,
    top: y,
    opacity: 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);

      // 立即更新位置，避免从旧位置跳转
      if (menuRef.current) {
        const menuHeight = menuRef.current.offsetHeight;
        const menuWidth = menuRef.current.offsetWidth;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        
        // 计算菜单应该显示的位置
        let finalX = x;
        let finalY = y;
        
        // 确保不超出右边界
        if (x + menuWidth > windowWidth - 10) {
          finalX = x - menuWidth;
        }
        
        // 确保不超出底部边界
        if (y + menuHeight > windowHeight - 10) {
          finalY = y - menuHeight;
        }
        
        // 确保不超出顶部和左边界
        finalX = Math.max(10, finalX);
        finalY = Math.max(10, finalY);

        setMenuStyle({
          left: finalX,
          top: finalY,
          opacity: 1,
        });
      }
    } else {
      setMenuStyle(prev => ({
        ...prev,
        opacity: 0,
      }));
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, x, y, onClose]);

  if (!items?.length) return null;

  return (
    <StyledMenuWrapper
      ref={menuRef}
      visible={visible}
      style={{
        left: menuStyle.left,
        top: menuStyle.top,
      }}
    >
      <StyledMenu
        items={items}
        onClick={onClose}
      />
    </StyledMenuWrapper>
  );
};

export default ContextMenu; 