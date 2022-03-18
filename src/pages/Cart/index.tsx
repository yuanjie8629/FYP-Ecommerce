import { logoutAPI } from '@api/services/authAPI';
import { findRoutePath } from '@utils/routingUtils';
import { removeSearchParams } from '@utils/urlUtls';
import {
  Drawer,
  DrawerProps,
  Grid,
  Input,
  List,
  Space,
  Typography,
} from 'antd';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

interface UserInfo {
  email: string;
}

interface CartProps extends DrawerProps {
  user?: UserInfo;
}
const Cart = ({ user, ...props }: CartProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  return <Drawer width={screens.sm ? 378 : '80%'} {...props}></Drawer>;
};

export default Cart;
