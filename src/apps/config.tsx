import {lazy} from 'react';
import {BookOutlined, createFromIconfontCN, ProjectOutlined, UserOutlined} from '@ant-design/icons';
import type {AppConfig} from './types';

// 懒加载组件
const Blog = lazy(() => import('./Blog'));
const Projects = lazy(() => import('./Projects'));
const Games = lazy(() => import('./Games'));
const About = lazy(() => import('./About'));

const GameConsoleOutlined = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4867432_2zuxg3mur8m.js",
})

const appConfigs: AppConfig[] = [
    {
        id: 1,
        name: '博客',
        icon: <BookOutlined/>,
        component: Blog,
        info: {
            version: '1.0.0',
            description: '我的个人博客，记录技术分享和生活感悟',
            author: 'ZQDesigned',
            homepage: 'https://blog.zqdesigned.city/blog?mode=standalone',
            releaseDate: '2024-03-20',
        },
    },
    {
        id: 2,
        name: '个人项目',
        icon: <ProjectOutlined/>,
        component: Projects,
        info: {
            version: '1.0.0',
            description: '展示我的个人项目作品集',
            author: 'ZQDesigned',
            homepage: 'https://blog.zqdesigned.city/projects?mode=standalone',
            releaseDate: '2024-03-20',
        },
    },
    {
        id: 3,
        name: '休闲游戏',
        icon: <GameConsoleOutlined type={"icon-a-Game-Console1"}/>,
        component: Games,
        info: {
            version: '1.0.0',
            description: '一些有趣的休闲小游戏',
            author: 'ZQDesigned',
            homepage: 'https://blog.zqdesigned.city/games?mode=standalone',
            releaseDate: '2024-03-20',
        },
    },
    {
        id: 4,
        name: '关于我',
        icon: <UserOutlined/>,
        component: About,
        info: {
            version: '1.0.0',
            description: '了解更多关于我的信息',
            author: 'ZQDesigned',
            homepage: 'https://blog.zqdesigned.city/about?mode=standalone',
            releaseDate: '2024-03-20',
        },
    },
];

export default appConfigs;
