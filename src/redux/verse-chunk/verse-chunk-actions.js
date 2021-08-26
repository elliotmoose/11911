export const [ADD_VERSE_CHUNK, SET_CURRENT_VERSE_CHUNK, COMPLETE_CURRENT_VERSE_CHUNK, LOAD_DATA] = ['ADD_VERSE_CHUNK', 'SET_CURRENT_VERSE_CHUNK', 'COMPLETE_CURRENT_VERSE_CHUNK', 'LOAD_DATA'];

export const addVerseChunk = (verseChunk) => ({
    type: ADD_VERSE_CHUNK,
    verseChunk,
});


export const setCurrentVerseChunk = (verseChunk) => ({
  type: SET_CURRENT_VERSE_CHUNK,
  verseChunk,
});

export const completeCurrentVerseChunk = () => ({
  type: COMPLETE_CURRENT_VERSE_CHUNK,
});

