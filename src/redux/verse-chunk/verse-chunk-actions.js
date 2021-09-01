import StorageManager from '../../managers/storage-manager';
import { memoryList } from './verse-chunk-selectors';
export const [ADD_VERSE_CHUNK, ADD_MEMORY_PACK, SET_CURRENT, COMPLETE_CURRENT_VERSE_CHUNK, SET_MEMORY_LIST] = ['ADD_VERSE_CHUNK', 'ADD_MEMORY_PACK', 'SET_CURRENT', 'COMPLETE_CURRENT_VERSE_CHUNK', 'SET_MEMORY_LIST'];

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

export function addMemoryPack(memoryPack) {
  return async function (dispatch, getState) {
    await dispatch({
      type: ADD_MEMORY_PACK,
      memoryPack,
    });
    
    console.warn('to save memory packs');
    // await StorageManager.saveMemoryList(memoryList(getState()));
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

export const setCurrent = (verseChunkIndex, memoryPackIndex=null) => ({
  type: SET_CURRENT,
  current: {packIndex: memoryPackIndex, verseChunkIndex},
});