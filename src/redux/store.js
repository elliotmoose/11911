import { combineReducers, createStore } from "redux";
import bibleReducers from "./bible/bible-reducers";
import verseChunkReducers from "./verse-chunk/verse-chunk-reducers";

let store = createStore(combineReducers({ verseChunk: verseChunkReducers, bible: bibleReducers }));
export default store;
