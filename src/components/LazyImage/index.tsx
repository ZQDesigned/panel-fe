import React, {useState} from 'react';
import {Spin} from 'antd';
import styled from '@emotion/styled';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
`;

const LazyImage: React.FC<LazyImageProps> = ({src, alt, ...props}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <ImageContainer>
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                style={{opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s'}}
                {...props}
            />
            {isLoading && (
                <LoadingContainer>
                    <Spin size="small"/>
                </LoadingContainer>
            )}
        </ImageContainer>
    );
};

export default LazyImage;
