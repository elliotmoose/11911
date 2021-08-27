export function memoryListDateSorted(state) {
    let memoryList = [...state.verseChunk.memoryList];
    memoryList.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated));
    return memoryList;
}

export function memoryList(state) {
    return state.verseChunk.memoryList;
}