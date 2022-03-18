import { itemDetailsAPI } from '@api/services/productAPI';
import Button from '@components/Button';
import Layout from '@components/Layout';
import { serverErrMsg } from '@utils/messageUtils';
import { prodCat } from '@utils/optionUtils';
import {
  Carousel,
  Col,
  Descriptions,
  Grid,
  Image,
  message,
  notification,
  Row,
  Space,
  Table,
  Tabs,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './ItemDetails.less';
import ItemDetailsSkeleton from './Skeleton/ItemDetailsSkeleton';

const ItemDetails = () => {
  const { TabPane } = Tabs;
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const { Text, Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(true);
  const [data, setData] = useState<any>({});
  const [images, setImages] = useState([]);
  const { useBreakpoint } = Grid;
  const [tabKey, setTabKey] = useState('description');
  const [notiApi, notiContextHolder] = notification.useNotification();

  const screens = useBreakpoint();

  const addToCart = () => {
    notiApi.success({
      message: 'Item added to cart',
      description:
        'You have successfully added an item to your cart. Please click the button below to checkout.',
    });
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      setLoading(true);
      itemDetailsAPI(id)
        .then((res) => {
          if (isMounted) {
            console.log(res.data);
            setData(res.data);
            let thumbnail = res.data?.thumbnail;
            let images = res.data?.image;
            console.log(images);
            setImages([thumbnail, ...images]);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response?.status !== 401) {
            console.log(err.response.status);
            showServerErrMsg();
            setActive(false);
          }
        });
      return () => {
        isMounted = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!screens.md) {
      setTabKey('details');
    } else {
      setTabKey('description');
    }
  }, [screens]);
  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  const prodColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Products Included',
      dataIndex: ['name', 'category', 'thumbnail'],
      key: 'name',
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row gutter={10}>
          {screens.md && (
            <Col span={5}>
              <Image src={data.thumbnail} height={80} width={80} />
            </Col>
          )}
          <Col>
            <Space direction='vertical' size={5}>
              <Text strong>{data.name}</Text>
              <Text type='secondary' className='text-sm'>
                {prodCat.find((cat) => cat.value === data.category)?.label
                  ? prodCat.find((cat) => cat.value === data.category)?.label
                  : data.category}
              </Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  return (
    <Layout>
      {contextHolder}
      {notiContextHolder}
      {loading ? (
        <ItemDetailsSkeleton active={active} />
      ) : (
        <Row justify='space-around' className='item-details'>
          <Col sm={24} md={12} className='item-image'>
            <Carousel autoplay>
              {images.length > 0 &&
                images.map((img, index) => (
                  <span>
                    <Image
                      src={img}
                      alt={`img-${index}`}
                      style={{
                        width: screens.md ? '100%' : '100vw',
                        border: '1px solid #e5e7eb',
                      }}
                    />
                  </span>
                ))}
            </Carousel>
          </Col>
          {screens.md && (
            <Col
              sm={24}
              md={12}
              style={{ paddingLeft: 25 }}
              className='full-width'
            >
              <Space direction='vertical' size={10} className='full-width'>
                <Space direction='vertical' size={5}>
                  <div>
                    <Title level={4} style={{ fontWeight: 700 }}>
                      {data.name}
                    </Title>
                    <Text type='secondary' className='text-lg'>
                      {data.category || 'Package'}
                    </Text>
                  </div>
                </Space>

                <ul className='item-details-list-info'>
                  <li>
                    <Text>
                      Weight <br /> {data.weight / 1000} kg
                    </Text>
                  </li>
                  <li>
                    <Text>
                      Dimension <br /> {parseFloat(data.length).toFixed()} x{' '}
                      {parseFloat(data.width).toFixed()} x{' '}
                      {parseFloat(data.height).toFixed()} cm
                    </Text>
                  </li>
                  <li>
                    <Text>
                      Availability <br />
                      {data.stock > 10 ? (
                        <Text strong className='color-primary'>
                          In Stock
                        </Text>
                      ) : data.stock < 10 && data.stock > 0 ? (
                        <Text strong className='color-primary'>
                          Low Stock
                        </Text>
                      ) : (
                        <Text strong type='danger'>
                          Out of Stock
                        </Text>
                      )}
                    </Text>
                  </li>
                  <li>
                    <Text>Price</Text>
                    <Row gutter={10}>
                      <Col>
                        <Text
                          strong
                          style={{ fontSize: 20 }}
                          className={!data.special_price && 'color-primary'}
                          delete={data.special_price}
                        >
                          RM {data.price}
                        </Text>
                      </Col>
                      {data.special_price && (
                        <Col>
                          <Text
                            strong
                            style={{ fontSize: 20 }}
                            className='color-primary'
                          >
                            RM {data.special_price}
                          </Text>
                        </Col>
                      )}
                    </Row>
                  </li>
                </ul>

                <Button
                  type='primary'
                  disabled={data.stock <= 0}
                  onClick={addToCart}
                >
                  Add To Cart
                </Button>
              </Space>
            </Col>
          )}

          <Col span={24} style={{ padding: 20 }}>
            <Tabs
              activeKey={tabKey}
              onChange={(activeKey) => {
                setTabKey(activeKey);
              }}
            >
              {!screens.md && (
                <TabPane tab='Details' key='details'>
                  <Space direction='vertical' size={10} className='full-width'>
                    <Descriptions column={1} bordered>
                      <Descriptions.Item label='Name'>
                        <Text strong>{data.name}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label='Category'>
                        <Text strong>{data.category || 'Package'}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label='Weight'>
                        <Text>{data.weight}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label='Dimension'>
                        <Text>
                          {parseFloat(data.length).toFixed()} x{' '}
                          {parseFloat(data.width).toFixed()} x{' '}
                          {parseFloat(data.height).toFixed()} cm
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label='Availability'>
                        {data.stock > 10 ? (
                          <Text strong className='color-primary'>
                            In Stock
                          </Text>
                        ) : data.stock < 10 && data.stock > 0 ? (
                          <Text strong className='color-primary'>
                            Low Stock
                          </Text>
                        ) : (
                          <Text strong type='danger'>
                            Out of Stock
                          </Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label='Price'>
                        <Row gutter={10}>
                          <Col>
                            <Text
                              strong
                              className={!data.special_price && 'color-primary'}
                              delete={data.special_price}
                            >
                              RM {data.price}
                            </Text>
                          </Col>
                          {data.special_price && (
                            <Col>
                              <Text strong className='color-primary'>
                                RM {data.special_price}
                              </Text>
                            </Col>
                          )}
                        </Row>
                      </Descriptions.Item>
                    </Descriptions>
                  </Space>
                </TabPane>
              )}
              <TabPane tab='Description' key='description'>
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
              </TabPane>
              {data.product && (
                <TabPane tab='Products Included' key='product'>
                  <Table
                    rowKey='id'
                    columns={prodColumns}
                    dataSource={data.product}
                    pagination={false}
                    style={{ padding: 10 }}
                  />
                </TabPane>
              )}
            </Tabs>
          </Col>
          {!screens.md && (
            <div style={{ padding: 20 }} className='full-width'>
              <Button
                type='primary'
                block
                disabled={data.stock <= 0}
                onClick={addToCart}
              >
                Add To Cart
              </Button>
            </div>
          )}
        </Row>
      )}
    </Layout>
  );
};

export default ItemDetails;
