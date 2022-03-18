import React, { Suspense } from 'react';
import { Layout as AntdLayout, RowProps } from 'antd';
import Header from './Header';
import PageLoad from '@components/Loading/PageLoad';

export interface CustomLayoutProps extends RowProps {
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  children?: React.ReactNode;
}

const Layout = ({ justify = 'center', ...props }: CustomLayoutProps) => {
  const { Content } = AntdLayout;
  return (
    <AntdLayout>
      <Header />
      <Suspense fallback={<PageLoad />}>
        <Content
          className='content'
          style={{
            width: '100%',
            margin: ' 0 auto',
            maxWidth: 1280,
          }}
        >
          {props.children}
        </Content>
      </Suspense>
    </AntdLayout>
  );
};

export default Layout;
