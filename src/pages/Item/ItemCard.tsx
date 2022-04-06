import { Row, Col, Card, Typography, Tag, CardProps, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ItemCardProps extends CardProps {
  info: { [key: string]: any };
}

const ItemCard = ({ info, ...props }: ItemCardProps) => {
  const { Text } = Typography;
  const { id, name, price, special_price, thumbnail } = info;
  const navigate = useNavigate();

  return (
    <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
      <Card
        hoverable
        cover={thumbnail ? <img alt='thumbnail' src={thumbnail} /> : null}
        onClick={() => {
          navigate(`/item/${id}`);
        }}
        {...props}
      >
        <Space direction='vertical' size={5} className='full-width'>
          <Row gutter={[10, 5]}>
            <Col>
              <Text strong>{name}</Text>
            </Col>
            {special_price && (
              <Col>
                <Tag color='success'>Sale</Tag>
              </Col>
            )}
          </Row>
          <Row gutter={[10, 5]}>
            <Col>
              <Text type='secondary' delete={special_price}>
                {`RM ${price}`}
              </Text>
            </Col>
            {special_price && (
              <Col>
                <Text
                  strong
                  className='color-primary'
                >{`RM ${special_price}`}</Text>
              </Col>
            )}
          </Row>
        </Space>
      </Card>
    </Col>
  );
};

export default ItemCard;
