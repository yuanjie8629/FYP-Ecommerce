import Layout from '@components/Layout';
import { Grid, Row, Space, Typography } from 'antd';

const AboutUs = () => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <Layout>
      <Row justify='center' style={{ padding: 20 }}>
        <Space
          direction='vertical'
          align='center'
          style={{ marginTop: 50, width: 500 }}
          size={50}
        >
          <Title level={screens.md ? 2 : 3}>About Us</Title>
          <Space
            direction='vertical'
            size={30}
            style={{ textAlign: 'justify' }}
          >
            <img
              src='https://res.cloudinary.com/yuanjie/image/upload/v1647630462/Shrf/hqjkSL3DzH2Ee6DD3rlJIUzp3uxNClUkFMnJ4cWz_pjpdsh.jpg'
              alt='about'
              width='100%'
            />
            <Space direction='vertical'>
              <Title level={5} className='color-primary'>
                The Ideas
              </Title>
              <Text style={{ fontSize: 20 }}>
                It starts with 'nasi lemak' sold at her friend shop at Penang.
                One hot sunny day, a foreigner asked, "How am I going to bring
                all this Malaysian Food back to my country?"
              </Text>
            </Space>
            <Space direction='vertical'>
              <Title level={5} className='color-primary'>
                Who are we?
              </Title>
              <Text style={{ fontSize: 20 }}>
                We a food processing company that specialises in the ready meals
                market. We aim is to provide quick, delicious and halal ready
                meals that can be prepared in just 3 minutes.
              </Text>
            </Space>
            <Space direction='vertical'>
              <Title level={5} className='color-primary'>
                What we sell?
              </Title>
              <Text style={{ fontSize: 20 }}>
                We have RTE packing available starting from our beloved Rendang,
                Sambal Sotong, Nasi Goreng and Nasi Biryani Gam series. Why cook
                when you are in a rush? Just heat Sharifah RTE up in 3 minutes,
                Voila! It is ready.
              </Text>
            </Space>
          </Space>
        </Space>
      </Row>
    </Layout>
  );
};

export default AboutUs;
