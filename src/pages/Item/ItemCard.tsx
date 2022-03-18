import { Row, Col, Card, Typography, Tag, CardProps } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ItemCardProps extends CardProps {
  info: { [key: string]: any };
}

const ItemCard = ({ info, ...props }: ItemCardProps) => {
  const { Text } = Typography;
  const { id, name, price, special_price, thumbnail } = info;
  const navigate = useNavigate();
  return (
    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
      <Card
        hoverable
        cover={thumbnail ? <img alt='thumbnail' src={thumbnail} /> : null}
        onClick={() => {
          navigate(`/item/${id}`);
        }}
        {...props}
      >
        <Row>
          <Text style={{ textAlign: 'center' }} strong>
            {name}
          </Text>
          {special_price && (
            <Tag style={{ marginLeft: 10 }} color='success'>
              Sale
            </Tag>
          )}
        </Row>
        <Row>
          <Text type='secondary' delete={special_price}>
            {`RM ${price}`}
          </Text>
          {special_price && (
            <Text style={{ marginLeft: 15 }}>{`RM ${special_price}`}</Text>
          )}
        </Row>
      </Card>
    </Col>
  );
};

export default ItemCard;
