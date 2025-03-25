import React from 'react';
import type {AppComponentProps} from '../types';
import IframePage from '../../components/IframePage';

const About: React.FC<AppComponentProps> = (props) => {
    return (
        <IframePage
            {...props}
            src="https://blog.zqdesigned.city/about?mode=standalone"
            title="关于我"
        />
    );
};

export default About;
