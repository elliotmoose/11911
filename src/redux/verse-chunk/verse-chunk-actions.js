import StorageManager from '../../managers/storage-manager';
import { memoryList } from './verse-chunk-selectors';
export const [ADD_VERSE_CHUNK, ADD_MEMORY_PACK, SET_CURRENT, COMPLETE_CURRENT_VERSE_CHUNK, LOAD_INITIAL_STATE] = ['ADD_VERSE_CHUNK', 'ADD_MEMORY_PACK', 'SET_CURRENT', 'COMPLETE_CURRENT_VERSE_CHUNK', 'LOAD_INITIAL_STATE'];

export function loadStorageToState() {
  return async function (dispatch, getState) {
    let savedState = await StorageManager.loadData();

    await dispatch({
      type: LOAD_INITIAL_STATE,
      ...savedState
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

export function offsetCurrentVerseChunkIndex(offset) {
  return async function (dispatch, getState) {

    let { current: {packIndex, verseChunkIndex}, memoryList, memoryPacks} = getState().verseChunk;

    let newVerseChunkIndex = verseChunkIndex + offset;

    let min = 0;
    let max;
    if(packIndex === null) {
      max = memoryList.length;
    }
    else {
      memoryPack = memoryPacks[packIndex];
      max = memoryPack.verseChunks.length;
    }

    if(newVerseChunkIndex < min) newVerseChunkIndex = max-1;
    if(newVerseChunkIndex > max) newVerseChunkIndex = 0;

    await dispatch({
      type: SET_CURRENT,
      current: {packIndex, verseChunkIndex: newVerseChunkIndex},
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

export const setCurrent = (verseChunkId, packId=null) => ({
  type: SET_CURRENT,
  current: {packId, verseChunkId},
});