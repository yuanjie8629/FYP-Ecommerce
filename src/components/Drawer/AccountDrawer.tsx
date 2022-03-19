import LoginRegModal from '@components/Modal/LoginRegModal';
import { findRoutePath } from '@utils/routingUtils';
import {
  Col,
  Drawer as AntdDrawer,
  DrawerProps as AntdDrawerProps,
  Grid,
  List,
  Row,
  Space,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

interface DrawerProps extends AntdDrawerProps {
  onMenuClick?: (route?) => void;
  onSearch?: (search: string) => void;
}
const Drawer = ({
  onMenuClick = () => null,
  onSearch = () => null,
  ...props
}: DrawerProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const routes = [
    { label: 'Order History', route: 'orderHistory' },
    { label: 'AddressBook', route: 'addressBook' },
    { label: 'Account Information', route: 'accountInfo' },
    { label: 'Become Agent/Dropshipepr', route: 'posReg' },
    { label: 'Logout', route: 'logout' },
  ];

  return (
    <AntdDrawer closable={false} width={screens.md ? 500 : '100%'} {...props}>
      <Space direction='vertical' size={30} className='full-width'>
   
        <Row
          align='top'
          style={{ paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}
        >
          <Col span={1}>
            <CloseOutlined
              className='color-grey'
              size={30}
              onClick={() => {
                onMenuClick();
              }}
            />
          </Col>
          <Col span={23} style={{ textAlign: 'center' }}>
            <Title level={5}>My Account</Title>
          </Col>
        </Row>
        <Space direction='vertical' size={30} className='full-width'>
          <List
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
                  <Text
                    strong
                    className='text-button text-sm'
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
                  </Text>
                )}
              </List.Item>
            )}
          />
        </Space>
      </Space>
      <LoginRegModal />
    </AntdDrawer>
  );
};

export default Drawer;
