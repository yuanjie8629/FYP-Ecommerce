import { DrawerProps, Grid, List, Space, Typography } from 'antd';
import Drawer from '.';

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
  const routes = [
    { label: 'Order History', route: 'orderHistory' },
    { label: 'Address Book', route: 'addressBook' },
    { label: 'Account Information', route: 'accountInfo' },
    { label: 'Logout', route: 'logout' },
  ];

  return (
    <Drawer title='My Account' width={screens.md ? 500 : '100%'} {...props}>
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
                  }}
                >
                  {item.label}
                </Title>
              )}
            </List.Item>
          )}
        />
      </Space>
    </Drawer>
  );
};

export default AccountDrawer;
