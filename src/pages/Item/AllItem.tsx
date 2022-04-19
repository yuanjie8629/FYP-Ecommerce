import { itemPrevAPI } from '@api/services/productAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { Empty, Row } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ItemCard from './ItemCard';
import SkeletonItem from './SkeletonItem';
import './ItemCard.less';
import { MessageContext } from '@contexts/MessageContext';
interface AllItemProps {
  onChange?: (total: number) => void;
}

const AllItem = ({ onChange = () => null, ...props }: AllItemProps) => {
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    itemPrevAPI(location.search)
      .then((res) => {
        if (isMounted) {
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
  }, [searchParams]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <div style={{ margin: 15 }}>
      <Row gutter={[40, 40]} className='item-list'>
        {loading ? (
          <SkeletonItem total={12} />
        ) : list?.length > 0 ? (
          list?.map((data) => <ItemCard key={data.id} info={data} />)
        ) : (
          <Row justify='center' className='full-width' style={{ padding: 20 }}>
            <Empty />
          </Row>
        )}
      </Row>
    </div>
  );
};

export default AllItem;
