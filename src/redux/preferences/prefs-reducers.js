import { SET_FONT_SCALE } from "./prefs-actions";

const initialState = {
    fontScale: 1
}

export default (state = initialState, action) => {
    switch (action.type) {

        case SET_FONT_SCALE:
            return { ...state, fontScale: action.fontScale };

        default:
            return state
    }
};
