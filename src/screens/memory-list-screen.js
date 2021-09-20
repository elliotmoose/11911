import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import MemoryListItem from '../components/memory-list-item';
import SwipableList from '../components/swipable-list';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const MemoryListScreen = ({ navigation, setCurrent, memoryList, deleteVerseChunk }) => {

    function onSelectVerseChunk(verseChunkId) {
        setCurrent(verseChunkId);
        navigation.goBack();
    }

    function onAddVerseChunkPressed() {
        navigation.navigate('AddVerseChunk');
    }

    const actions = {
        right: [
            {
                color: Colors.red, 
                text: 'Delete', 
                callback: (item)=>deleteVerseChunk(item.key)
            },
        ],
        left: [],
    }


    return (
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 0}}>
                    <Text allowFontScaling={false} style={{...Fonts.h1}}>My Memory List</Text>
                    <TouchableOpacity style={{height: '100%', width: 22}} onPress={onAddVerseChunkPressed}>
                        <Text allowFontScaling={false} style={{fontSize: 30}}>+</Text>
                    </TouchableOpacity>
                </View>
                <SwipableList 
                    data={memoryList.map((verseChunk, i)=>({key: verseChunk.id, verseChunk}))}
                    renderItem={ (data, rowMap) => {
                        let verseChunk = data.item.verseChunk;
                        let verseChunkId = verseChunk.id;
                        let onPress = ()=>onSelectVerseChunk(verseChunkId);
                        return (<MemoryListItem onPress={onPress} verseChunk={verseChunk} key={data.item.key}/>);
                    }}
                    actions={actions}
                />
            </View>
        </SafeAreaView>
    );
};


import { deleteVerseChunk, setCurrent } from '../redux/verse-chunk/verse-chunk-actions';
import { memoryListDateSorted } from '../redux/verse-chunk/verse-chunk-selectors';

const mapStateToProps = (state) => ({
    memoryList: memoryListDateSorted(state),
});
const mapDispatchToProps = {
    setCurrent,
    deleteVerseChunk
};

export default connect(mapStateToProps, mapDispatchToProps)(MemoryListScreen);
