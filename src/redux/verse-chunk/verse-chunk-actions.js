import StorageManager from '../../managers/storage-manager';
import { memoryListPack, userMemoryPacks } from './verse-chunk-selectors';
export const [ADD_VERSE_CHUNK, DELETE_VERSE_CHUNK, ADD_MEMORY_PACK, SAVE_EDIT_MEMORY_PACK, DELETE_MEMORY_PACK, SET_CURRENT, COMPLETE_CURRENT_VERSE_CHUNK, LOAD_INITIAL_STATE] = ['ADD_VERSE_CHUNK', 'DELETE_VERSE_CHUNK', 'ADD_MEMORY_PACK', 'SAVE_EDIT_MEMORY_PACK', 'DELETE_MEMORY_PACK', 'SET_CURRENT', 'COMPLETE_CURRENT_VERSE_CHUNK', 'LOAD_INITIAL_STATE'];

export function loadVerseChunkStorageToState() {
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
    
    await StorageManager.saveMemoryList(memoryListPack(getState()));
  }
}

export function deleteVerseChunk(id) {
  return async function (dispatch, getState) {
    await dispatch({
      type: DELETE_VERSE_CHUNK,
      verseChunkId: id,
    });
    
    await StorageManager.saveMemoryList(memoryListPack(getState()));
  }
}

export function addMemoryPack(memoryPack) {
  return async function (dispatch, getState) {
    await dispatch({
      type: ADD_MEMORY_PACK,
      memoryPack,
    });
    
    await StorageManager.saveMemoryPacks(userMemoryPacks(getState()));
  }
}

export function saveEditMemoryPack(memoryPackId, name, verseChunks) {
  return async function (dispatch, getState) {
    await dispatch({
      type: SAVE_EDIT_MEMORY_PACK,
      memoryPackId, 
      verseChunks, 
      name,
    });
    
    await StorageManager.saveMemoryPacks(userMemoryPacks(getState()));
  }
}

export function deleteMemoryPack(id) {
  return async function (dispatch, getState) {
    await dispatch({
      type: DELETE_MEMORY_PACK,
      memoryPackId: id,
    });
    
    await StorageManager.saveMemoryPacks(userMemoryPacks(getState())); 
  }
}

export function completeCurrentVerseChunk() {
  return async function (dispatch, getState) {
    await dispatch({
      type: COMPLETE_CURRENT_VERSE_CHUNK,
    });

    await StorageManager.saveMemoryList(memoryListPack(getState()));
    await StorageManager.saveMemoryPacks(userMemoryPacks(getState()));
  }
}

export function setCurrent(verseChunkId, packId=null) {
  return async function (dispatch, getState) {
    await dispatch({
      type: SET_CURRENT,
      current: { packId, verseChunkId },
    });

    await StorageManager.saveCurrent(getState().verseChunk.current);
  }
}