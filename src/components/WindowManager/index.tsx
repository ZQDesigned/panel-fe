import React from 'react';
import {useWindow} from '../../contexts/WindowContext';
import Window from '../Window';

const WindowManager: React.FC = () => {
    const {state} = useWindow();

    return (
        <>
            {state.windows
                .filter(window => !window.isMinimized)
                .map(window => (
                    <Window key={window.id} window={window}/>
                ))}
        </>
    );
};

export default WindowManager;
