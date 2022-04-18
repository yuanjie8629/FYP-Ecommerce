import { DrawerProps, Grid, Space } from 'antd';
import React from 'react';
import Drawer from '@components/Drawer';

interface LoginDrawerProps extends DrawerProps {
  title: string;
  children?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

const LoginDrawer = ({
  title,
  children,
  closeIcon,
  ...props
}: LoginDrawerProps) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <Drawer
      title={title}
      destroyOnClose
      width={screens.md ? 500 : '100%'}
      {...props}
    >
      <Space direction='vertical' size={30} className='full-width'>
        {children}
      </Space>
    </Drawer>
  );
};

export default LoginDrawer;
