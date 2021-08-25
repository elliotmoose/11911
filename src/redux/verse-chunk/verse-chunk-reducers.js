import { createVerseChunk } from "../../managers/test-manager";
import { ADD_VERSE_CHUNK, SET_CURRENT_VERSE_CHUNK } from "./verse-chunk-actions";

const initialState = {
  memoryList: [createVerseChunk('psalms', 119, 11), createVerseChunk('joshua', 1, 8)],
  currentVerseChunk: createVerseChunk('psalms', 119, 1, 8),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_VERSE_CHUNK:
      if(action.verseChunk) {
        let memoryList = [...state.memoryList, action.verseChunk];
        return { ...state, memoryList };
      }
      return state;
    case SET_CURRENT_VERSE_CHUNK:
      return { ...state, currentVerseChunk: action.verseChunk };
    default:
      return state;
  }
};
