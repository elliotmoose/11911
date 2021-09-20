import StorageManager from "../../managers/storage-manager";

export const [SET_FONT_SCALE, SET_PREFS] = ['SET_FONT_SCALE', 'SET_PREFS'];

export function setFontScale(fontScale) {
    return async function (dispatch, getState) {

        await dispatch({
            type: SET_FONT_SCALE,
            fontScale
        });

        await StorageManager.savePrefs(getState().prefs);
    }
}

export function loadPrefsStorageToState() {
    return async function (dispatch, getState) {

        let prefs = await StorageManager.loadPrefs();
        
        await dispatch({
            type: SET_PREFS,
            prefs
        });
    }
}
