import React from 'react';
import type { AppComponentProps } from '../types';
import IframePage from '../../components/IframePage';

const Blog: React.FC<AppComponentProps> = (props) => {
  return (
    <IframePage
      {...props}
      src="https://blog.zqdesigned.city/blog?mode=standalone"
      title="我的博客"
    />
  );
};

export default Blog; 