import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createAPI } from '../services/api';
import { fetchCameraByIdAction, fetchCamerasAction, fetchDiscountAction, fetchPromoCameraAction, fetchReviewsAction, fetchSimilarCamerasAction, postOrderAction, postReviewAction } from './api-actions';
import { APIRoute } from '../const';
import { State } from '../types/state';
import { makeFakeCamera, makeFakePromoCamera, makeFakeReview } from '../utils/mocks';
import { PostReviewData } from '../types/review';
import { PostOrderData } from '../types/order';

const mockCameras = [makeFakeCamera(), makeFakeCamera()];
const mockCamera = makeFakeCamera();
const mockPromoCamera = makeFakePromoCamera();
const mockReviews = [makeFakeReview(), makeFakeReview()];

describe('Async actions', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];

  const mockStore = configureMockStore<
      State,
      Action<string>,
      ThunkDispatch<State, typeof api, Action>
    >(middlewares);

  describe('get cameras action', () => {
    it('should dispatch Load_Cameras when GET /cameras', async () => {
      mockAPI
        .onGet(APIRoute.Cameras)
        .reply(200, mockCameras);

      const store = mockStore();

      await store.dispatch(fetchCamerasAction());

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        fetchCamerasAction.pending.type,
        fetchCamerasAction.rejected.type
      ]);
    });

  });


  describe('get camera action', () => {
    it('should dispatch Load_Camera when GET /cameras/:id', async () => {

      mockAPI
        .onGet(`${APIRoute.Cameras}/${mockCamera.id}`)
        .reply(200, mockCamera);

      const store = mockStore();

      await store.dispatch(fetchCameraByIdAction(mockCamera.id));

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        fetchCameraByIdAction.pending.type,
        fetchCameraByIdAction.rejected.type
      ]);
    });

  });


  describe('get promo camera action', () => {
    it('should dispatch Load_PromoCamera when GET /promo', async () => {

      mockAPI
        .onGet(APIRoute.Promo)
        .reply(200, mockPromoCamera);

      const store = mockStore();

      await store.dispatch(fetchPromoCameraAction());

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        fetchPromoCameraAction.pending.type,
        fetchPromoCameraAction.fulfilled.type
      ]);
    });

  });


  describe('get similar cameras action', () => {
    it('should dispatch Load_SimilarCameras when GET /favorite', async () => {

      mockAPI
        .onGet(`${APIRoute.Cameras}/${mockCamera.id}/${APIRoute.SimilarCameras}`)
        .reply(200, mockCameras);

      const store = mockStore();

      await store.dispatch(fetchSimilarCamerasAction(mockCamera.id));

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        fetchSimilarCamerasAction.pending.type,
        fetchSimilarCamerasAction.rejected.type
      ]);
    });

  });


  describe('get reviews action', () => {
    it('should dispatch Load_Reviews when GET /cameras/:id/reviews', async () => {

      mockAPI
        .onGet(`${APIRoute.Cameras}/${mockCamera.id}/${APIRoute.CamerasReviews}`)
        .reply(200, mockReviews);

      const store = mockStore();

      await store.dispatch(fetchReviewsAction(mockCamera.id));

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        fetchReviewsAction.pending.type,
        fetchReviewsAction.fulfilled.type
      ]);
    });

  });


  describe('post review action', () => {

    it('should dispatch Review and fetch reviews when POST /reviews', async () => {
      const fakeReview: PostReviewData = {
        cameraId: 5,
        userName: 'test name',
        advantage: 'test advantage',
        disadvantage: 'test disadvantage',
        review: 'test comment',
        rating: 8,
      };

      mockAPI
        .onPost(APIRoute.ReviewPost)
        .reply(200);

      const store = mockStore();

      await store.dispatch(postReviewAction(fakeReview));

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        postReviewAction.pending.type,
        fetchReviewsAction.pending.type,
        postReviewAction.fulfilled.type
      ]);


    });

  });

  describe('get cart discount action', () => {
    it('should dispatch Load_Discount when POST /coupons', async () => {

      const coupon = 'camera-333';

      mockAPI
        .onPost(APIRoute.CouponVerification)
        .reply(200, 15);

      const store = mockStore();

      await store.dispatch(fetchDiscountAction(coupon));

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        fetchDiscountAction.pending.type,
        fetchDiscountAction.fulfilled.type
      ]);
    });

  });

  describe('post order action', () => {

    it('should dispatch order when POST /orders', async () => {
      const fakeOrder: PostOrderData = {
        camerasIds: [2, 3],
        coupon: null,
      };

      mockAPI
        .onPost(APIRoute.OrderPost)
        .reply(200);

      const store = mockStore();

      await store.dispatch(postOrderAction(fakeOrder));

      const actions = store.getActions().map(({type}) => type);

      expect(actions).toEqual([
        postOrderAction.pending.type,
        postOrderAction.fulfilled.type
      ]);


    });

  });


});
