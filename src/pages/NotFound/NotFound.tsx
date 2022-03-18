import { Row, Image, Typography, Space } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import Img404 from '@assets/404.svg';
import './NotFound.less';
import { BoldTitle } from '@components/Title';

const NotFound = () => {
  const { Text } = Typography;
  const navigate = useNavigate();
  return (
    <Row justify='center' align='middle' className='not-found'>
      <Space direction='vertical' size={30}>
        <Row className='not-found-img-container'>
          <Image
            src={Img404}
            alt='img404'
            preview={false}
            className='not-found-img'
          />
        </Row>
        <Row>
          <Space
            direction='vertical'
            size={15}
            className='not-found-text-container'
          >
            <BoldTitle className='not-found-title'>Oops!</BoldTitle>
            <Text className='not-found-text'>
              Looks like you followed a bad link. If you think this is a problem
              with us, please tell us.
            </Text>
          </Space>
        </Row>
        <Row justify='center'>
          <Button
            type='primary'
            className='not-found-btn'
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Row>
      </Space>
    </Row>
  );
};

export default NotFound;
