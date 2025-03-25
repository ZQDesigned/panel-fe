import React, {ReactNode} from 'react';

export interface AppComponentProps {
    windowId: string;
}

export interface AppInfo {
    version: string;
    description: string;
    author: string;
    homepage?: string;
    releaseDate?: string;
}

export interface AppConfig {
    id: number;
    name: string;
    icon: ReactNode;
    component: React.FC<AppComponentProps>;
    settingsComponent?: React.FC<AppComponentProps>;
    info?: AppInfo;
}
