import React, { Suspense } from 'react';
import { Layout as AntdLayout, RowProps } from 'antd';
import Header, { drawerOpenProps, drawerProps } from './Header';
import PageLoad from '@components/Loading/PageLoad';

export interface CustomLayoutProps extends RowProps {
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  children?: React.ReactNode;
  drawerOpen?: drawerOpenProps;
  onDrawerClose?: (drawer: drawerProps) => void;
}

const Layout = ({
  justify = 'center',
  drawerOpen,
  onDrawerClose,
  ...props
}: CustomLayoutProps) => {
  const { Content } = AntdLayout;
  return (
    <AntdLayout>
      <Header
        drawerOpen={drawerOpen}
        onDrawerClose={(drawer) => {
          onDrawerClose(drawer);
        }}
      />
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
