import { SET_FONT_SCALE, SET_PREFS } from "./prefs-actions";

const initialState = {
    fontScale: 1
}

export default (state = initialState, action) => {
    switch (action.type) {

        case SET_FONT_SCALE:
            return { ...state, fontScale: action.fontScale };
        case SET_PREFS:
            if(!action.prefs) return state;
            return action.prefs;
        default:
            return state
    }
};
