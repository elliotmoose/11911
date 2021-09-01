export function memoryListDateSorted(state) {
    let memoryList = [...state.verseChunk.memoryList];
    memoryList.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated));
    return memoryList;
}

export function memoryPacksDateSorted(state) {
    let memoryPacks = [...state.verseChunk.memoryPacks];
    memoryPacks.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated));
    return memoryPacks;
}

export function memoryList(state) {
    return state.verseChunk.memoryList;
}

export function currentVerseChunk(state) {
    let { packIndex, verseChunkIndex } = state.verseChunk.current;
    if(packIndex === null) {
        return state.verseChunk.memoryList[verseChunkIndex];
    }
    else {
        let memoryPack = state.verseChunk.memoryPacks[packIndex];
        if(!memoryPack) return null;
        return memoryPack.verseChunks[verseChunkIndex];
    }
}

export function getNeighbourVerseChunks(state) {
    let { packIndex, verseChunkIndex } = state.verseChunk.current;
    if(packIndex === null) {
        let memoryList = state.verseChunk.memoryList;        
        return {
            next: memoryList[verseChunkIndex-1],
            prev: memoryList[verseChunkIndex+1],
        }
    }
    else {
        let memoryPack = state.verseChunk.memoryPacks[packIndex];
        return {
            next: memoryPack?.verseChunks[verseChunkIndex-1],
            prev: memoryPack?.verseChunks[verseChunkIndex+1],
        }
    }
}

export function currentPackName(state) {
    let { packIndex } = state.verseChunk.current;
    if(packIndex === null) return "My Memory List"

    let memoryPack = state.verseChunk.memoryPacks[packIndex];
    if(!memoryPack) return "";
    let name = memoryPack.name;
    let nameLengthLimit = 15;
    // if(name.length > nameLengthLimit) name = name.slice(0, nameLengthLimit) + "..."
    return `${name} (${memoryPack.completionCount()}/${memoryPack.verseChunks.length} completed)`;
}