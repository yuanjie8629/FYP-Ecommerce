import { Col, Drawer, DrawerProps, Grid, Row, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React from 'react';

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
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <Drawer
      destroyOnClose
      closable={false}
      width={screens.md ? 500 : '100%'}
      {...props}
    >
      <Space direction='vertical' size={30} className='full-width'>
        <Row
          align='top'
          style={{ paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}
        >
          <Col span={1} style={{ position: 'absolute', zIndex: 5 }}>
            {closeIcon ? (
              closeIcon
            ) : (
              <CloseOutlined
                className='color-grey'
                size={30}
                onClick={() => {
                  props.onClose(null);
                }}
              />
            )}
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={5}>{title}</Title>
          </Col>
        </Row>
        {children}
      </Space>
    </Drawer>
  );
};

export default LoginDrawer;
