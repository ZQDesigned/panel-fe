import React from 'react';
import type {AppComponentProps} from '../types';
import IframePage from '../../components/IframePage';

const Games: React.FC<AppComponentProps> = (props) => {
    return (
        <IframePage
            {...props}
            src="https://blog.zqdesigned.city/games?mode=standalone"
            title="休闲游戏"
        />
    );
};

export default Games;
