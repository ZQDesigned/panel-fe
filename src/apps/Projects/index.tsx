import React from 'react';
import type { AppComponentProps } from '../types';
import IframePage from '../../components/IframePage';

const Projects: React.FC<AppComponentProps> = (props) => {
  return (
    <IframePage
      {...props}
      src="https://blog.zqdesigned.city/projects?mode=standalone"
      title="个人项目"
    />
  );
};

export default Projects; 