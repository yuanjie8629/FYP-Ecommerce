import Layout from '@components/Layout';
import { Row, Space, Typography } from 'antd';

const AboutUs = () => {
  const { Text, Title } = Typography;
  return (
    <Layout>
      <Row justify='center' style={{ padding: 20 }}>
        <Space
          direction='vertical'
          align='center'
          style={{ marginTop: 50, width: 500 }}
          size={50}
        >
          <Title>About Us</Title>
          <Space direction='vertical' style={{ textAlign: 'justify' }}>
            <Title level={5} className='color-primary'>
              The Ideas
            </Title>
            <Text style={{ fontSize: 20 }}>
              It starts with 'nasi lemak' sold at her friend shop at Penang. One
              hot sunny day, a foreigner asked, "How am I going to bring all
              this Malaysian Food back to my country?"
            </Text>
          </Space>
          <img
            src='https://res.cloudinary.com/yuanjie/image/upload/v1647630462/hqjkSL3DzH2Ee6DD3rlJIUzp3uxNClUkFMnJ4cWz_pjpdsh.jpg'
            alt='about'
            width='100%'
          />
        </Space>
      </Row>
    </Layout>
  );
};

export default AboutUs;
