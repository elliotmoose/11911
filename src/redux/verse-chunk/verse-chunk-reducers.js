import { Alert } from "react-native";
import { createMemoryPack, createVerseChunk } from "../../helpers/verse-helper";
import { ADD_VERSE_CHUNK, LOAD_DATA, SET_CURRENT, COMPLETE_CURRENT_VERSE_CHUNK, LOAD_INITIAL_STATE, ADD_MEMORY_PACK, DELETE_VERSE_CHUNK, DELETE_MEMORY_PACK, SAVE_EDIT_MEMORY_PACK } from "./verse-chunk-actions";

let memoryListPack = createMemoryPack({id: null, name: 'My Memory List', verseChunks: {}});

let introMemoryPack = createMemoryPack({name: 'The Heart', verseChunks: {}});

const initialState = {
	current: {packId: null, verseChunkId: null},
	memoryListPack: memoryListPack,
	userMemoryPacks: {}
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
	try {
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
					let verseChunks = state.memoryListPack.verseChunks;
					verseChunks[action.verseChunk.id] = action.verseChunk;
					return { ...state, memoryListPack: {...state.memoryListPack, verseChunks}}
				}
				return state;
			case DELETE_VERSE_CHUNK: {
				if(action.verseChunkId) {
					let {[action.verseChunkId]: deletedVerseChunk, ...newVerseChunks} = state.memoryListPack.verseChunks;
					return { ...state, memoryListPack: {...state.memoryListPack, verseChunks: newVerseChunks}}
				}
			}
			case ADD_MEMORY_PACK:
				if (action.memoryPack) {
					return {...state, userMemoryPacks: {...state.userMemoryPacks, [action.memoryPack.id]: action.memoryPack}};
				}
				return state;
			case SAVE_EDIT_MEMORY_PACK: {

				let {memoryPackId, verseChunks, name} = action;
				if(memoryPackId && verseChunks && name) {						
					let savedMemoryPack = {...state.userMemoryPacks[memoryPackId], name, verseChunks};
					return {...state, userMemoryPacks: {...state.userMemoryPacks, [memoryPackId]: savedMemoryPack}};
				}
				return state;
			}
			case DELETE_MEMORY_PACK: {
				if(action.memoryPackId) {
					let {[action.memoryPackId]: deletedMemoryPack, ...newMemoryPacks} = state.userMemoryPacks;
					return {...state, userMemoryPacks: newMemoryPacks};
				}
				return state;
			}
			case SET_CURRENT:
				let {packId, verseChunkId} = action.current;
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
				let { memoryListPack, userMemoryPacks, current: { verseChunkId, packId } } = state;
				if(packId === null) {				
					let verseChunk = memoryListPack.verseChunks[verseChunkId];
					let newVerseChunk = {...verseChunk, completionDate: new Date()};
					return { ...state, memoryListPack: {...memoryListPack, verseChunks: {...memoryListPack.verseChunks, [verseChunkId]: newVerseChunk}}};
				}
				else {
					let memoryPack = userMemoryPacks[packId];
					if(!memoryPack) return state;
					memoryPack.verseChunks[verseChunkId] = {...memoryPack.verseChunks[verseChunkId], completionDate: new Date()};
	
					//check for pack completion 
					let completed = true;
					for(let verseChunk of Object.values(memoryPack.verseChunks)) {
						if(!verseChunk.completionDate) {
							completed = false;
							break;
						}
					}
	
					if(completed) {
						memoryPack = {...memoryPack, completionDate: new Date()}
					}
	
					return {...state, userMemoryPacks: {...userMemoryPacks, [packId]: memoryPack}};				
				}
			}
			default:
				return state;
		}
	} catch (error) {
		console.error(error.stack);
	}
};
