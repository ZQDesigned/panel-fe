import React from 'react';
import styled from '@emotion/styled';
import type {AppComponentProps} from '../../apps/types';

const IframeContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: white;
`;

interface IframePageProps extends AppComponentProps {
    src: string;
    title: string;
}

const IframePage: React.FC<IframePageProps> = ({src, title}) => {
    return (
        <IframeContainer>
            <StyledIframe
                src={src}
                title={title}
            />
        </IframeContainer>
    );
};

export default IframePage;
