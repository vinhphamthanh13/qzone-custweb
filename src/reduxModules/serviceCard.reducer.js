import { SET_PROVIDER_SLOTS, SET_EARLIEST_SLOT, CLEAR_EARLIEST_SLOT } from './serviceCard.actions';

const initState = {
  providerSlots: {},
  earliestSlot: {
    step: 0,
    bookingDialog: {
      provider: {},
      time: {},
    },
  },
};

const serviceCardReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_PROVIDER_SLOTS:
      return {
        ...state,
        providerSlots: action.payload,
      };
    case SET_EARLIEST_SLOT:
      console.log('earliest slo in Redux', action.payload);
      return {
        ...state,
        earliestSlot: action.payload,
      };
    case CLEAR_EARLIEST_SLOT:
      return {
        ...state,
        earliestSlot: {},
      };
    default:
      return { ...state };
  }
};

export default serviceCardReducer;
