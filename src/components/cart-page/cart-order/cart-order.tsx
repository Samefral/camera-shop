import { useAppDispatch, useAppSelector } from '../../../hooks';
import { postOrderAction } from '../../../store/api-actions';
import { PostOrderData } from '../../../types/order';
import { getTotalCartPrice, getCartDiscount, getCartCameras, getCartDiscountCoupon } from '../../../store/cart-data/selectors';
import { formatPrice } from '../../../utils/utils';


function CartOrder(): JSX.Element {
  const totalPrice = useAppSelector(getTotalCartPrice);
  const discountPercent = useAppSelector(getCartDiscount);
  const discount = Math.round(totalPrice / 100 * discountPercent);

  const dispatch = useAppDispatch();

  const cartCameras = useAppSelector(getCartCameras);
  const cartCamerasIds = cartCameras.map((camera) => camera.id);
  const discountCoupon = useAppSelector(getCartDiscountCoupon);

  const postData: PostOrderData = {
    camerasIds: cartCamerasIds,
    coupon: discountCoupon
  };

  const handleOrderBtnClick = () => {
    dispatch(postOrderAction(postData));
  };

  return (
    <div className="basket__summary-order">
      <p className="basket__summary-item">
        <span className="basket__summary-text">Всего:</span>
        <span className="basket__summary-value">{formatPrice(totalPrice)}</span>
      </p>
      <p className="basket__summary-item">
        <span className="basket__summary-text">Скидка:</span>
        <span
          className=
            {`${discountCoupon ? 'basket__summary-value basket__summary-value--bonus' : 'basket__summary-value'}`}
        >
          {formatPrice(discount)}
        </span>
      </p>
      <p className="basket__summary-item">
        <span className="basket__summary-text basket__summary-text--total">К оплате:</span>
        <span className="basket__summary-value basket__summary-value--total">{formatPrice(totalPrice - discount)}</span>
      </p>
      <button
        className="btn btn--purple"
        type="submit"
        onClick={handleOrderBtnClick}
      >
        Оформить заказ
      </button>
    </div>
  );
}

export default CartOrder;
