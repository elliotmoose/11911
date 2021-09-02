import { mod } from "../../helpers/math-helper";

function sortedVerseChunkListByCreateDate(list) {
    return list.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated));
}
export function memoryListDateSorted(state) {
    let memoryList = Object.values(state.verseChunk.memoryListPack.verseChunks);
    return sortedVerseChunkListByCreateDate(memoryList);
}

export function memoryPacksDateSorted(state) {
    let userMemoryPacksList = Object.values(state.verseChunk.userMemoryPacks);
    userMemoryPacksList.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated));
    return userMemoryPacksList;
}

export function memoryListPack(state) {
    return state.verseChunk.memoryListPack;
}
export function userMemoryPacks(state) {
    return state.verseChunk.userMemoryPacks;
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

    let { packId, verseChunkId } = state.verseChunk.current;
    let memoryPack = ((packId === null) ? state.verseChunk.memoryListPack : state.verseChunk.userMemoryPacks[packId]);
    if(!memoryPack) return {next: null, prev: null};
    let verseChunkList = sortedVerseChunkListByCreateDate(Object.values(memoryPack.verseChunks));

    if(verseChunkList.length <= 1) return {next: null, prev: null};

    let currentIndex = verseChunkList.findIndex((each)=> each.id == verseChunkId);

    if(currentIndex == -1) return {next: null, prev: null}; 

    let prevIndex = mod(currentIndex-1, verseChunkList.length);
    let nextIndex = mod(currentIndex+1, verseChunkList.length);

    return {
        prev: verseChunkList[prevIndex],
        next: verseChunkList[nextIndex],
    }

}

export function currentPack(state) {
    let { packId } = state.verseChunk.current;
    return (packId === null) ? state.verseChunk.memoryListPack : state.verseChunk.userMemoryPacks[packId];
}