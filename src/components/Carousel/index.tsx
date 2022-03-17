import { Carousel } from 'antd';
import './MainCarousel.less';
import Carousel1 from '@assets/Carousel/carousel1.jpg';
import Carousel2 from '@assets/Carousel/carousel2.jpg';
const MainCarousel = () => {
  return (
    <Carousel autoplay>
      <div>
        <img src={Carousel1} alt='carousel1' />
      </div>
      <div>
        <img src={Carousel2} alt='carousel2'/>
      </div>
    </Carousel>
  );
};

export default MainCarousel;