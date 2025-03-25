import React from 'react';
import {Spin, Typography} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import styled from '@emotion/styled';

const {Text} = Typography;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 32px;
`;

const StyledSpin = styled(Spin)`
    margin-right: 12px;
`;

const LoadingSpinner: React.FC = () => {
    return (
        <LoadingContainer>
            <StyledSpin
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 24,
                            color: '#1890ff',
                        }}
                        spin
                    />
                }
                tip="加载中..."
            />
            <Text>加载中...</Text>
        </LoadingContainer>
    );
};

export default LoadingSpinner;
