import { SET_PROVIDER_SLOTS } from './serviceCard.actions';

const initState = {
  providerSlots: {},
};

const serviceCardReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_PROVIDER_SLOTS:
      return {
        ...state,
        providerSlots: action.payload,
      };
    default:
      return { ...state };
  }
};

export default serviceCardReducer;
