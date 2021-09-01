import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import MemoryListItem from '../components/memory-list-item';
import Fonts from '../constants/fonts';

const MemoryListScreen = ({ navigation, setCurrent, memoryList }) => {

    function onSelectVerseChunk(index) {
        setCurrent(index);
        navigation.goBack();
    }

    function onAddVerseChunkPressed() {
        navigation.navigate('AddVerseChunk');
    }

    return (
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
            <View style={{flex: 1, padding: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{...Fonts.h1}}>My Memory List</Text>
                    <TouchableOpacity style={{height: '100%', width: 22}} onPress={onAddVerseChunkPressed}>
                        <Text style={{fontSize: 30}}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {memoryList.map((verseChunk, i) => {
                        let onPress = ()=>onSelectVerseChunk(i);
                        return (<MemoryListItem onPress={onPress} verseChunk={verseChunk} key={`${i}`}/>);
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};


import { setCurrent } from '../redux/verse-chunk/verse-chunk-actions';
import { memoryListDateSorted } from '../redux/verse-chunk/verse-chunk-selectors';

const mapStateToProps = (state) => ({
    memoryList: memoryListDateSorted(state),
});
const mapDispatchToProps = {
    setCurrent
};

export default connect(mapStateToProps, mapDispatchToProps)(MemoryListScreen);
