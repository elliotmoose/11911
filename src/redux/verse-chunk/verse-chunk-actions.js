import StorageManager from '../../managers/storage-manager';
import { memoryList } from './verse-chunk-selectors';
export const [ADD_VERSE_CHUNK, SET_CURRENT_VERSE_CHUNK, SET_CURRENT_MEMORY_PACK, COMPLETE_CURRENT_VERSE_CHUNK, SET_MEMORY_LIST] = ['ADD_VERSE_CHUNK', 'SET_CURRENT_VERSE_CHUNK', 'SET_CURRENT_MEMORY_PACK', 'COMPLETE_CURRENT_VERSE_CHUNK', 'SET_MEMORY_LIST'];

export function loadMemoryList() {
  return async function (dispatch, getState) {
    let memoryList = await StorageManager.loadMemoryList();
    await dispatch({
      type: SET_MEMORY_LIST,
      memoryList
    });
  }
}

export function addVerseChunk(verseChunk) {
  return async function (dispatch, getState) {
    await dispatch({
      type: ADD_VERSE_CHUNK,
      verseChunk,
    });
    
    await StorageManager.saveMemoryList(memoryList(getState()));
  }
}

export function completeCurrentVerseChunk() {
  return async function (dispatch, getState) {
    await dispatch({
      type: COMPLETE_CURRENT_VERSE_CHUNK,
    });

    await StorageManager.saveMemoryList(memoryList(getState()));
  }
}

export const setCurrentVerseChunk = (verseChunk) => ({
  type: SET_CURRENT_VERSE_CHUNK,
  verseChunk,
});

export function setCurrentMemoryPack() {
  return async function (dispatch, getState) {
    dispatch({
      type: SET_CURRENT_MEMORY_PACK,
      verseChunk,
    });
  }
}