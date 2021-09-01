import { Alert } from "react-native";
import { createMemoryPack, createVerseChunk } from "../../helpers/verse-helper";
import { loadMemoryList } from "../../managers/storage-manager";
import { ADD_VERSE_CHUNK, LOAD_DATA, SET_CURRENT, COMPLETE_CURRENT_VERSE_CHUNK, SET_MEMORY_LIST, ADD_MEMORY_PACK } from "./verse-chunk-actions";

const initialState = {
	current: {packIndex: null, verseChunkIndex: 0},
	memoryList: [createVerseChunk('psalms', 119, 11), createVerseChunk('joshua', 1, 8)],
	memoryPacks: [createMemoryPack('The Heart', [createVerseChunk('jeremiah', 17, 9), createVerseChunk('matthew', 5, 8,null, new Date())])],
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
		case SET_MEMORY_LIST:
			return {...state, memoryList: action.memoryList};
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
				let { memoryPacks } = state;
				let newMemoryPacks = [...memoryPacks, action.memoryPack];
				return {...state, memoryPacks: newMemoryPacks};
			}
			return state;
		case SET_CURRENT:
			return { ...state, current: action.current };
		case COMPLETE_CURRENT_VERSE_CHUNK:
			let { memoryList, memoryPacks } = state;

			let { packIndex, verseChunkIndex } = state.verseChunk.current;
			if(packIndex === null) {				
				let verseChunk = memoryList[verseChunkIndex];
				memoryList[verseChunkIndex] = {...verseChunk, completionDate: new Date()};
				return { ...state, memoryList };
			}
			else {
				let memoryPack = memoryPacks[packIndex];
				if(!memoryPack) return state;
				memoryPack.verseChunks[verseChunkIndex] = {...memoryPack.verseChunks[verseChunkIndex], completionDate: new Date()};
				let newMemoryPacks = [...memoryPacks]; //copy
				newMemoryPacks[packIndex] = memoryPack;
				return {...state, memoryPacks: newMemoryPacks};				
			}
		default:
			return state;
	}
};
