import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = 'xiaohe404';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={
        <>
          {`${currentYear} ${defaultMessage}`} |{' '}
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            渝ICP备2023017835号-1
          </a> |{' '}
          <a target={'_blank'} href={'https://beian.mps.gov.cn/#/query/webSearch?code=50010102001299'}
             rel="noreferrer">
            <img src="http://img.xiaohe.icu/logo/%E5%A4%87%E6%A1%88%E5%9B%BE%E6%A0%87.png"
                 alt={'渝公网安备50010102001299号'}/> 渝公网安备50010102001299号
          </a>
        </>
      }
      links={[
        {
          key: 'github',
          title: <GithubOutlined/>,
          href: 'https://github.com/xiaohe404/xhapi-backend.git',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
