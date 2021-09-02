import { Alert } from "react-native";
import { createMemoryPack, createVerseChunk } from "../../helpers/verse-helper";
import { ADD_VERSE_CHUNK, LOAD_DATA, SET_CURRENT, COMPLETE_CURRENT_VERSE_CHUNK, LOAD_INITIAL_STATE, ADD_MEMORY_PACK } from "./verse-chunk-actions";

let psalms119 = createVerseChunk({book: 'psalms', chapter: 119, verseStart: 11})
let joshua1 = createVerseChunk({book: 'joshua', chapter: 1, verseStart: 8, completionDate: new Date()})
let memoryListPack = createMemoryPack({id: null, name: 'My Memory List', verseChunks: {
	[psalms119.id] : psalms119,
	[joshua1.id] : joshua1,
}});

let jeremiah17 = createVerseChunk({book: 'jeremiah', chapter: 17, verseStart: 9})
let matthew5 = createVerseChunk({book: 'matthew', chapter: 5, verseStart: 8, completionDate: new Date()})
let introMemoryPack = createMemoryPack({name: 'The Heart', verseChunks: {
	[jeremiah17.id]: jeremiah17,
	[matthew5.id]: matthew5,
}});

const initialState = {
	current: {packId: introMemoryPack.id, verseChunkId: jeremiah17.id},
	memoryListPack: memoryListPack,
	userMemoryPacks: {[introMemoryPack.id]: introMemoryPack}
};

function indexOfVerseChunk(memoryList, verseChunk) {
	if (!verseChunk) return -1;
	for (let i = 0; i < memoryList.length; i++) {
		let ref = memoryList[i];
		if (!ref) continue;
		let { book: refBook, chapter: refChapter, verseStart: refVerseStart, verseEnd: refVerseEnd } = ref;
		let { book, chapter, verseStart, verseEnd } = verseChunk;

		if (book == refBook && chapter == refChapter && verseStart == refVerseStart && verseEnd == refVerseEnd) {
			return i;
		}
	}

	return -1;
}

export default (state = initialState, action) => {
	switch (action.type) {
		case LOAD_INITIAL_STATE : {
			let { memoryListPack, userMemoryPacks, current } = action;

			console.log(current);
			console.log(Object.keys(memoryListPack))
			console.log(Object.keys(userMemoryPacks))
			if(!current) {
				current = { packId: null /** memory list */, verseChunkId: Object.values(memoryListPack.verseChunks)[0]?.id}
			}

			
			return { ...state, memoryListPack, userMemoryPacks, current};
		}
		case ADD_VERSE_CHUNK:
			if (action.verseChunk) {
				if (indexOfVerseChunk(state.memoryList, action.verseChunk) == -1) {
					let memoryList = [...state.memoryList, action.verseChunk];
					return { ...state, memoryList };
				}
				else {
					Alert.alert('Duplicate Verse', 'You have already added this verse!');
					return state;
				}
			}
			return state;
		case ADD_MEMORY_PACK:
			if (action.memoryPack) {
				return {...state, userMemoryPacks: {...state.userMemoryPacks, [action.memoryPack.id]: action.memoryPack}};
			}
			return state;
		case SET_CURRENT:
			let {packId, verseChunkId} = action.current;
			console.log('set current', packId, verseChunkId)
			if(verseChunkId == null) {
				if(packId === null) {
					verseChunkId = Object.values(state.memoryListPack.verseChunks)[0].id
				}
				else {					
					let memoryPack = state.userMemoryPacks[packId];
					if(!memoryPack) return state;
					verseChunkId = Object.values(memoryPack.verseChunks)[0].id;
				}
			}
			return { ...state, current: {verseChunkId, packId} };
		case COMPLETE_CURRENT_VERSE_CHUNK : {
			let { memoryListPack, userMemoryPacks } = state;

			let { verseChunkId, packId } = state.verseChunk.current;
			if(packId === null) {				
				let verseChunk = memoryListPack.verseChunks[verseChunkId];
				let newVerseChunk = {...verseChunk, completionDate: new Date()};
				return { ...state, memoryListPack: {...memoryListPack, verseChunks: {...memoryListPack.verseChunks, [verseChunkId]: newVerseChunk}}};
			}
			else {
				let memoryPack = userMemoryPacks[packId];
				if(!memoryPack) return state;
				memoryPack.verseChunks[verseChunkId] = {...memoryPack.verseChunks[verseChunkId], completionDate: new Date()};
				return {...state, userMemoryPacks: {...userMemoryPacks, [packId]: memoryPack}};				
			}
		}
		default:
			return state;
	}
};
