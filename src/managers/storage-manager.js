import AsyncStorage from "@react-native-community/async-storage";
import { createVerseChunk } from "../helpers/verse-helper";


export async function saveMemoryList(memoryList) {
    await AsyncStorage.setItem('MEMORY_LIST', JSON.stringify(memoryList));
}

export async function loadMemoryList() {
    let memoryList = await AsyncStorage.getItem('MEMORY_LIST');
    if(!memoryList) {
        memoryList = [createVerseChunk('psalms', 119, 11), createVerseChunk('joshua', 1, 8)];
    }
    else {
        memoryList = JSON.parse(memoryList);
    }
    return memoryList.map((item) => {
        let { book, chapter, verseStart, verseEnd, completionDate, dateCreated } = item;
        return createVerseChunk(book, chapter, verseStart, verseEnd, completionDate, dateCreated);
    });
}

const StorageManager = { saveMemoryList, loadMemoryList };
export default StorageManager;