import { Card, CardProps, Grid } from 'antd';
import './MainCard.less';

const MainCard = ({ className, ...props }: CardProps) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: screens.md ? 35 : 20 }}
      className={`main-card full-width full-height${
        className !== undefined ? ` ${className}` : ''
      }`}
      {...props}
    />
  );
};

export default MainCard;
