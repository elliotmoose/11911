import { Alert } from "react-native";
import { createVerseChunk } from "../../helpers/verse-helper";
import { loadMemoryList } from "../../managers/storage-manager";
import { ADD_VERSE_CHUNK, LOAD_DATA, SET_CURRENT_VERSE_CHUNK, COMPLETE_CURRENT_VERSE_CHUNK, SET_MEMORY_LIST } from "./verse-chunk-actions";

const initialState = {
	memoryList: [createVerseChunk('psalms', 119, 11), createVerseChunk('joshua', 1, 8)],
	currentVerseChunk: createVerseChunk('psalms', 119, 1, 8),
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
		case SET_CURRENT_VERSE_CHUNK:
			return { ...state, currentVerseChunk: action.verseChunk };
		case COMPLETE_CURRENT_VERSE_CHUNK:
			let { memoryList } = state;
			let index = indexOfVerseChunk(memoryList, state.currentVerseChunk);
			let verseChunkIsInMemoryList = (index != -1);
			if(verseChunkIsInMemoryList) {
				let verseChunk = memoryList[index];
				memoryList[index] = {...verseChunk, completionDate: new Date()};
				return { ...state, memoryList };
			}
			else {				
				//verse chunk does not exist in list, so we add it
				memoryList.push(state.currentVerseChunk);
				return { ...state, memoryList };
			}
		default:
			return state;
	}
};
