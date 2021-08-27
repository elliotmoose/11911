import { applyMiddleware, combineReducers, createStore } from "redux";
import bibleReducers from "./bible/bible-reducers";
import verseChunkReducers from "./verse-chunk/verse-chunk-reducers";
import thunk from 'redux-thunk';

let store = createStore(combineReducers({ verseChunk: verseChunkReducers, bible: bibleReducers }), applyMiddleware(thunk));
export default store;
