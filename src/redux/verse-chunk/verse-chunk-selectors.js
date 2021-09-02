export function memoryListDateSorted(state) {
    let memoryList = Object.values(state.verseChunk.memoryListPack.verseChunks);
    memoryList.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated));
    return memoryList;
}

export function memoryPacksDateSorted(state) {
    let userMemoryPacksList = Object.values(state.verseChunk.userMemoryPacks);
    userMemoryPacksList.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated));
    return userMemoryPacksList;
}

export function memoryList(state) {
    return state.verseChunk.memoryList;
}

export function currentVerseChunk(state) {
    let { packId, verseChunkId } = state.verseChunk.current;
    console.log(state.verseChunk.current);
    
    
    if(packId === null) {
        if(!verseChunkId) verseChunkId = Object.values(state.verseChunk.memoryListPack.verseChunks)[0].id; //default to first 
        return state.verseChunk.memoryListPack.verseChunks[verseChunkId];
    }
    else {
        let memoryPack = state.verseChunk.userMemoryPacks[packId];
        if(!memoryPack) return null;
        return memoryPack.verseChunks[verseChunkId];
    }
}

export function getNeighbourVerseChunks(state) {
    console.warn('get neighbour implementation')
    return {next: null, prev: null}
    // let { packId, verseChunkId } = state.verseChunk.current;
    // if(packId === null) {
    //     let memoryListPack = state.verseChunk.memoryListPack;        
    //     return {
    //         next: memoryListPack[verseChunkId-1],
    //         prev: memoryListPack[verseChunkId+1],
    //     }
    // }
    // else {
    //     let memoryPack = state.verseChunk.userMemoryPacks[packId];
    //     return {
    //         next: memoryPack?.verseChunks[verseChunkId-1],
    //         prev: memoryPack?.verseChunks[verseChunkId+1],
    //     }
    // }
}

export function currentPackName(state) {
    let { packId } = state.verseChunk.current;
    if(packId === null) return "My Memory List"

    let memoryPack = state.verseChunk.userMemoryPacks[packId];
    if(!memoryPack) return "";
    let name = memoryPack.name;
    let nameLengthLimit = 15;
    // if(name.length > nameLengthLimit) name = name.slice(0, nameLengthLimit) + "..."
    return memoryPack.nameWithCompletion;
}