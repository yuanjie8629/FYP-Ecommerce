import {
  Col,
  Drawer as AntdDrawer,
  DrawerProps as AntdDrawerProps,
  Grid,
  Row,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface DrawerProps extends AntdDrawerProps {
  title: React.ReactNode;
}
const Drawer = ({ title, ...props }: DrawerProps) => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <AntdDrawer
      headerStyle={{ padding: 24 }}
      title={
        <Row align='top' className='full-width'>
          <Col span={1} style={{ position: 'absolute', zIndex: 10 }}>
            <CloseOutlined
              className='color-grey'
              size={30}
              onClick={() => {
                props.onClose(null);
              }}
            />
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={5}>{title}</Title>
          </Col>
        </Row>
      }
      closable={false}
      width={screens.md ? 500 : '100%'}
      {...props}
    >
      {props.children}
    </AntdDrawer>
  );
};
export default Drawer;
