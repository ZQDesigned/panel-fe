import React from 'react';
import { Modal, Descriptions } from 'antd';
import type { AppInfo } from '../../apps/types';

interface AppInfoModalProps {
  visible: boolean;
  onClose: () => void;
  appName: string;
  appIcon: React.ReactNode;
  info?: AppInfo;
}

const AppInfoModal: React.FC<AppInfoModalProps> = ({
  visible,
  onClose,
  appName,
  appIcon,
  info,
}) => {
  if (!info) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{appIcon}</span>
          <span>{appName}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="版本">{info.version}</Descriptions.Item>
        <Descriptions.Item label="描述">{info.description}</Descriptions.Item>
        <Descriptions.Item label="作者">{info.author}</Descriptions.Item>
        {info.homepage && (
          <Descriptions.Item label="主页">
            <a href={info.homepage} target="_blank" rel="noopener noreferrer">
              {info.homepage}
            </a>
          </Descriptions.Item>
        )}
        {info.releaseDate && (
          <Descriptions.Item label="发布日期">{info.releaseDate}</Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default AppInfoModal; 