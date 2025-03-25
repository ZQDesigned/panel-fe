import React from 'react';
import styled from '@emotion/styled';
import {Card, Divider, Typography} from 'antd';
import {GithubOutlined, GlobalOutlined, LinkOutlined, MailOutlined, QqOutlined,} from '@ant-design/icons';
import {globalStyles} from '../../styles/theme';

const {Title, Link} = Typography;

const SidebarContainer = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: ${globalStyles.spacing.lg};
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledCard = styled(Card)`
  box-shadow: ${globalStyles.shadows.small};
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${globalStyles.spacing.sm};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.sm};
  color: ${globalStyles.colors.text};
  font-size: 14px;
  padding: 4px 0;

  &:hover {
    color: ${globalStyles.colors.primary};
  }

  .anticon {
    font-size: 16px;
  }
`;

const LeftSidebar: React.FC = () => {
    const socialLinks = [
        {
            icon: <GithubOutlined/>,
            text: 'GitHub',
            url: 'https://github.com/ZQDesigned',
        },
        {
            icon: <LinkOutlined/>,
            text: '掘金',
            url: 'https://juejin.cn/user/3908089946578621',
        },
        {
            icon: <GlobalOutlined/>,
            text: '个人博客',
            url: 'https://blog.zqdesigned.city',
        },
    ];

    const contactLinks = [
        {
            icon: <MailOutlined/>,
            text: '发送邮件',
            url: 'mailto:zqdesigned@mail.lnyynet.com',
        },
        {
            icon: <QqOutlined/>,
            text: 'QQ',
            url: 'https://qm.qq.com/q/J5dgcCZl2U',
        }
    ];

    const relativeLinks = [
        {
            text: '项目仓库',
            url: 'https://github.com/ZQDesigned/panel-fe',
        },
        {
            text: 'Ant Design',
            url: 'https://ant.design',
        },
        {
            text: 'React',
            url: 'https://reactjs.org',
        },
        {
            text: 'TypeScript',
            url: 'https://www.typescriptlang.org',
        },
        {
            text: 'Emotion',
            url: 'https://emotion.sh',
        },
        {
            text: 'LoliAPI',
            url: 'https://www.loliapi.cn',
        }
    ];

    return (
        <SidebarContainer>
            <StyledCard>
                <Title level={5}>社交媒体</Title>
                <LinkGroup>
                    {socialLinks.map((link, index) => (
                        <StyledLink key={index} href={link.url} target="_blank">
                            {link.icon} {link.text}
                        </StyledLink>
                    ))}
                </LinkGroup>

                <Divider style={{margin: '16px 0'}}/>

                <Title level={5}>联系方式</Title>
                <LinkGroup>
                    {contactLinks.map((link, index) => (
                        <StyledLink key={index} href={link.url} target="_blank">
                            {link.icon} {link.text}
                        </StyledLink>
                    ))}
                </LinkGroup>

                <Divider style={{margin: '16px 0'}}/>

                <Title level={5}>相关链接</Title>
                <LinkGroup>
                    {relativeLinks.map((link, index) => (
                        <StyledLink key={index} href={link.url} target="_blank">
                            {link.text}
                        </StyledLink>
                    ))}
                </LinkGroup>
            </StyledCard>
        </SidebarContainer>
    );
};

export default LeftSidebar;
