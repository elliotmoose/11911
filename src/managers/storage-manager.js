import AsyncStorage from "@react-native-community/async-storage";
import { createMemoryPack, createVerseChunk } from "../helpers/verse-helper";

//STORAGE_KEYS
const [MEMORY_LIST, MEMORY_PACKS, CURRENT] = ['MEMORY_LIST', 'MEMORY_PACKS', 'CURRENT'];
const RESET_STORAGE = true;

export async function saveMemoryList(memoryList) {
    await AsyncStorage.setItem(MEMORY_LIST, JSON.stringify(memoryList));
}

export async function saveMemoryPacks(memoryPacks) {
    await AsyncStorage.setItem(MEMORY_PACKS, JSON.stringify(memoryPacks));
}

export async function saveCurrent(current) {
    await AsyncStorage.setItem(CURRENT, JSON.stringify(current));
}

async function loadMemoryList() {
    if (RESET_STORAGE) await AsyncStorage.removeItem(MEMORY_LIST);
    let memoryListString = await AsyncStorage.getItem(MEMORY_LIST);

    if(!memoryListString) {
        let psalms119 = createVerseChunk({book: 'psalms', chapter: 119, verseStart: 11})
        let joshua1 = createVerseChunk({book: 'joshua', chapter: 1, verseStart: 8})
        let memoryListPack = createMemoryPack({id: null, name: 'My Memory List', verseChunks: {
            [psalms119.id] : psalms119,
            [joshua1.id] : joshua1,
        }});

        console.log('==INIT APP: creating memory list')
        saveMemoryList(memoryListPack);

        return memoryListPack;
    }
    else {
        let memoryListPack = createMemoryPack(JSON.parse(memoryListString));        
        return memoryListPack;
    }
}

async function loadMemoryPacks() {
    if (RESET_STORAGE) await AsyncStorage.removeItem(MEMORY_PACKS);

    let userMemoryPacksString = await AsyncStorage.getItem(MEMORY_PACKS);
    if(!userMemoryPacksString) {
        let jeremiah17 = createVerseChunk({book: 'jeremiah', chapter: 17, verseStart: 9})
        let matthew5 = createVerseChunk({book: 'matthew', chapter: 5, verseStart: 8})
        let proverbs4 = createVerseChunk({book: 'proverbs', chapter: 4, verseStart: 23})
        let psalms51 = createVerseChunk({book: 'psalms', chapter: 51, verseStart: 7, verseEnd: 10})
        let introMemoryPack = createMemoryPack({name: 'The Heart', verseChunks: {
            [matthew5.id]: matthew5,
            [proverbs4.id]: proverbs4,
            [jeremiah17.id]: jeremiah17,
            [psalms51.id]: psalms51,
        }})

        let userMemoryPacks = {
            [introMemoryPack.id]: introMemoryPack,
        };

        console.log('==INIT APP: creating memory packs')
        saveMemoryPacks(userMemoryPacks);

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
    if (RESET_STORAGE) await AsyncStorage.removeItem(CURRENT);
    let currentString = await AsyncStorage.getItem(CURRENT);
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

const StorageManager = { saveMemoryList, saveMemoryPacks, saveCurrent, loadData };
export default StorageManager;