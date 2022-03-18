import { productPrevAPI } from '@api/services/productAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { Empty, message, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ItemCard from './ItemCard';
import SkeletonItem from './SkeletonItem';
import './ItemCard.less';
import { prodCat } from '@utils/optionUtils';
import { removeSearchParams } from '@utils/urlUtls';

interface AllProductProps {
  onChange?: (total: number) => void;
}

const AllProduct = ({ onChange = () => null, ...props }: AllProductProps) => {
  const { TabPane } = Tabs;
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    productPrevAPI(location.search)
      .then((res) => {
        if (isMounted) {
          console.log(res.data.results);
          setList(res.data.results);
          onChange(res.data.count);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  return (
    <div style={{ margin: 10 }}>
      {contextHolder}
      <Tabs
        defaultActiveKey='all'
        onChange={(activeKey) => {
          if (activeKey !== 'all')
            setSearchParams({ ...searchParams, category: activeKey });
          else setSearchParams(removeSearchParams(searchParams, 'category'));
        }}
      >
        <TabPane tab='All' key='all' />
        {prodCat.map((cat) => (
          <TabPane tab={cat.label} key={cat.value} />
        ))}
      </Tabs>
      <Row gutter={[40, 40]} className='item-list'>
        {loading ? (
          <SkeletonItem total={12} />
        ) : list.length > 0 ? (
          list.map((data) => <ItemCard info={data} />)
        ) : (
          <Row justify='center' className='full-width' style={{ padding: 20 }}>
            <Empty />
          </Row>
        )}
      </Row>
    </div>
  );
};

export default AllProduct;