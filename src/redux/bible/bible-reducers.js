import { SET_CURRENT_BIBLE } from "./bible-actions";

let niv = require('../../../assets/niv.json');

const initialState = {
    currentBible: niv
}

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_CURRENT_BIBLE:
    return { ...state };

  default:
    return state
  }
};
