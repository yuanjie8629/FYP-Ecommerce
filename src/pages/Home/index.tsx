import Layout from '@components/Layout';
import Pagination from '@components/Pagination';
import AllItem from '@pages/Item/AllItem';
import AllPackage from '@pages/Item/AllPackage';
import AllProduct from '@pages/Item/AllProduct';
import { Tabs, Space, Row, Col } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const { TabPane } = Tabs;
  const [itemCount, setItemCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Layout>
      <Space direction='vertical' size={20} className='full-width'>
        <Tabs
          defaultActiveKey='all'
          centered
          onChange={(activeKey) => {
            setSearchParams('');
          }}
        >
          <TabPane tab='All' key='all'>
            <AllItem
              onChange={(total) => {
                setItemCount(total);
              }}
            />
          </TabPane>

          <TabPane tab='Products' key='product'>
            <AllProduct
              onChange={(total) => {
                setItemCount(total);
              }}
            />
          </TabPane>
          <TabPane tab='Packages' key='package'>
            <AllPackage
              onChange={(total) => {
                setItemCount(total);
              }}
            />
          </TabPane>
          {/* <TabPane tab='Ready-To-Eat' key='rte'></TabPane>
        <TabPane tab='Ready-To-Cook' key='rtc'></TabPane>
        <TabPane tab='Paste' key='paste'></TabPane> */}
        </Tabs>
        {itemCount > 0 && (
          <Row justify='end' style={{ marginBottom: 10, marginRight: 10 }}>
            <Col>
              <Pagination total={itemCount} />
            </Col>
          </Row>
        )}
      </Space>
    </Layout>
  );
};

export default Home;
