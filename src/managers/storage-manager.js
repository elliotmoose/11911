import AsyncStorage from "@react-native-community/async-storage";
import { createMemoryPack, createVerseChunk } from "../helpers/verse-helper";

const RESET_STORAGE = true;
export async function saveMemoryList(memoryList) {
    await AsyncStorage.setItem('MEMORY_LIST', JSON.stringify(memoryList));
}

async function loadMemoryList() {
    let memoryListString = await AsyncStorage.getItem('MEMORY_LIST');

    if(!memoryListString || RESET_STORAGE) {

        let psalms119 = createVerseChunk({book: 'psalms', chapter: 119, verseStart: 11})
        let joshua1 = createVerseChunk({book: 'joshua', chapter: 1, verseStart: 8, completionDate: new Date()})
        let memoryListPack = createMemoryPack({id: null, name: 'My Memory List', verseChunks: {
            [psalms119.id] : psalms119,
            [joshua1.id] : joshua1,
        }});
        return memoryListPack;
    }
    else {
        let memoryListPack = createMemoryPack(JSON.parse(memoryListString));        
        return memoryListPack;
    }
}

async function loadMemoryPacks() {
    let userMemoryPacksString = await AsyncStorage.getItem('MEMORY_PACKS');
    if(!userMemoryPacksString || RESET_STORAGE) {
        let jeremiah17 = createVerseChunk({book: 'jeremiah', chapter: 17, verseStart: 9})
        let matthew5 = createVerseChunk({book: 'matthew', chapter: 5, verseStart: 8, completionDate: new Date()})
        let introMemoryPack = createMemoryPack({name: 'The Heart', verseChunks: {
            [jeremiah17.id]: jeremiah17,
            [matthew5.id]: matthew5,
        }})

        let userMemoryPacks = {
            [introMemoryPack.id]: introMemoryPack,
        };

        return userMemoryPacks;
    }
    else { 
        let memoryPacksData = JSON.parse(userMemoryPacksString);
        let userMemoryPacks = {};
        Object.values(memoryPacksData).forEach(memoryPack => {
            userMemoryPacks[memoryPack.id] = createMemoryPack(memoryPack);
        });
        
        return userMemoryPacks;
    }
}

async function loadCurrent() {
    let currentString = await AsyncStorage.getItem('CURRENT');
    if(!currentString) {
        return null;
    }
    else {
        let current = JSON.parse(currentString);
        return current;
    }
}

export async function loadData() {
    let memoryListPack = await loadMemoryList();
    let userMemoryPacks = await loadMemoryPacks();
    let current = await loadCurrent();

    return { memoryListPack, userMemoryPacks, current };
}

const StorageManager = { saveMemoryList, loadData };
export default StorageManager;