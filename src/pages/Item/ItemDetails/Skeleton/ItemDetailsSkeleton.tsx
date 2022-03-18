import React from 'react';
import { Row, Col, Skeleton, SkeletonProps, Grid } from 'antd';
import './ItemDetailsSkeleton.less';

interface ItemDetailsSkeletonProps extends SkeletonProps {}

const ItemDetailsSkeleton = (props: ItemDetailsSkeletonProps) => {
  const { Button } = Skeleton;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <Row className='item-details-skeleton-wrapper' justify='space-around'>
      <Col sm={24} md={12} className='item-details-skeleton-image'>
        <Skeleton
          loading={true}
          active
          avatar={{ shape: 'square' }}
          paragraph={false}
          title={false}
          {...props}
        />
      </Col>
      {screens.md && (
        <>
          <Col sm={24} md={12} className='item-details-skeleton-description'>
            <Skeleton
              loading={true}
              active
              avatar={false}
              paragraph={{
                rows: 5,
                width: ['50%', '50%', '50%', '50%', '50%'],
              }}
              title={{ width: '70%' }}
              {...props}
            />
            <Button active size='large' {...props} />
          </Col>
          <Col span={24}>
            <Skeleton
              loading={true}
              active
              avatar={false}
              paragraph={{
                rows: 10,
                width: '100%',
              }}
              {...props}
            />
          </Col>
        </>
      )}
      {!screens.md && (
        <div style={{ padding: 20 }} className='full-width'>
          <Button active size='large' block {...props} />

          <Skeleton
            loading={true}
            active
            avatar={false}
            paragraph={{ rows: 8, width: '100%' }}
            title={{ width: '100%' }}
            {...props}
          />

          <Button active size='large' block {...props} />
        </div>
      )}
    </Row>
  );
};

export default ItemDetailsSkeleton;
