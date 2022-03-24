import { findRoutePath } from '@utils/routingUtils';
import {
  Col,
  Drawer,
  DrawerProps,
  Grid,
  List,
  Row,
  Space,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface AccountDrawerProps extends DrawerProps {
  onMenuClick?: (route?) => void;
  onSearch?: (search: string) => void;
}
const AccountDrawer = ({
  onMenuClick = () => null,
  onSearch = () => null,
  ...props
}: AccountDrawerProps) => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const routes = [
    { label: 'Order History', route: 'orderHistory' },
    { label: 'Address Book', route: 'addressBook' },
    { label: 'Account Information', route: 'accountInfo' },
    { label: 'Logout', route: 'logout' },
  ];

  return (
    <Drawer closable={false} width={screens.md ? 500 : '100%'} {...props}>
      <Space direction='vertical' size={30} className='full-width'>
        <Row
          align='top'
          style={{ paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}
        >
          <Col span={1} style={{ position: 'absolute', zIndex: 5 }}>
            <CloseOutlined
              className='color-grey'
              size={30}
              onClick={() => {
                onMenuClick();
              }}
            />
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={5}>My Account</Title>
          </Col>
        </Row>
        <Space direction='vertical' size={30} className='full-width'>
          <List
            rowKey='route'
            dataSource={routes.map((route) => route)}
            renderItem={(item) => (
              <List.Item className='text-button-wrapper'>
                {screens.sm ? (
                  <Title
                    level={5}
                    className='text-button '
                    onClick={() => {
                      onMenuClick(item.route);
                      if (
                        ['login', 'register', 'logout'].includes(item.route) &&
                        screens.md
                      ) {
                        return;
                      }
                      navigate(findRoutePath(item.route));
                    }}
                  >
                    {item.label}
                  </Title>
                ) : (
                  <Title
                    level={5}
                    className='text-button'
                    onClick={() => {
                      onMenuClick(item.route);
                      if (
                        ['login', 'register', 'logout'].includes(item.route) &&
                        screens.md
                      ) {
                        return;
                      }
                      navigate(findRoutePath(item.route));
                    }}
                  >
                    {item.label}
                  </Title>
                )}
              </List.Item>
            )}
          />
        </Space>
      </Space>
    </Drawer>
  );
};

export default AccountDrawer;
