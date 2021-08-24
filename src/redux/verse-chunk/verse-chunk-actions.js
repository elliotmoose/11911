export const [ADD_VERSE_CHUNK, SET_CURRENT_VERSE_CHUNK] = ['ADD_VERSE_CHUNK', 'SET_CURRENT_VERSE_CHUNK'];

export const addVerseChunk = (verseChunk) => ({
    type: ADD_VERSE_CHUNK,
    verseChunk,
});


export const setCurrentVerseChunk = (verseChunk) => ({
  type: SET_CURRENT_VERSE_CHUNK,
  verseChunk,
});

