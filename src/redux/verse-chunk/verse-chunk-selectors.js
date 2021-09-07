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

export function packNameExists(state, packName) {
    for(let pack of Object.values(state.verseChunk.userMemoryPacks)) {
        if(pack.name.toLowerCase() == packName.toLowerCase()) return true;
    }

    return false;
}

export function currentVerseChunk(state) {
    let memoryPack = currentPack(state);
    if(!memoryPack) return null;
    
    let {verseChunkId } = state.verseChunk.current;
    return memoryPack.verseChunks[verseChunkId];
}

export function getNeighbourVerseChunks(state) {

    let { packId, verseChunkId } = state.verseChunk.current;
    let memoryPack = ((packId === null) ? state.verseChunk.memoryListPack : state.verseChunk.userMemoryPacks[packId]);
    if(!memoryPack) return {next: null, prev: null};
    let verseChunkList = sortedVerseChunkListByCreateDate(Object.values(memoryPack.verseChunks));
    verseChunkList.reverse();

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