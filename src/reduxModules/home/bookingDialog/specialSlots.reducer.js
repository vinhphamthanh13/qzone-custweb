import { SET_LOADING } from 'actions/common';
import { SET_SLOTS_BY_SPECIAL_ID } from 'reduxModules/home/bookingDialog/specialSlots.actions';

const initState = {
  isLoading: false,
  specialSlots: {},
};

const specialSlots = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_SLOTS_BY_SPECIAL_ID:
      return {
        ...state,
        specialSlots: {
          ...state.specialSlots,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default specialSlots;
