import Button from '@components/Button';
import Layout from '@components/Layout';
import { Descriptions, Grid, Row, Space, Typography } from 'antd';

const ContactUs = () => {
  const { Title } = Typography;
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
          <Title level={screens.md ? 2 : 3}>Contact Us</Title>
          <img
            src='https://res.cloudinary.com/yuanjie/image/upload/v1647631178/Shrf/CWsvQDdMzQXzyjWhAWpnspIglduIexnipPo1R8Oa_o3ebpw.jpg'
            alt='contact'
            width='100%'
          />
          <Descriptions bordered column={1}>
            <Descriptions.Item label='Email'>
              <Button type='link' href='mailto:fyp.shrf@gmail.com'>
                fyp.shrf@gmail.com
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label='Phone'>+60 1234 56789</Descriptions.Item>
            <Descriptions.Item label='Address'>
              Lot 4, Kompleks Industri Makanan MARA, KM 13, Jalan Batu Caves,
              68100 Kuala Lumpur, Selangor
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Row>
    </Layout>
  );
};

export default ContactUs;
