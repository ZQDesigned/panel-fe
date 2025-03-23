import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <MainLayout />
    </ConfigProvider>
  );
};

export default App;
