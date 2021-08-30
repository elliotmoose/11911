import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import MemoryPackItem from '../components/memory-pack-item';
import Fonts from '../constants/fonts';

const MemoryPacksScreen = ({ navigation, setCurrentMemoryPack, memoryPacks }) => {

    function onSelectMemoryPack(index) {
        setCurrentMemoryPack(memoryPacks[index]);
        navigation.goBack();
    }

    function onCreateMemoryPackPressed() {
        navigation.navigate('AddMemoryPack');
    }

    return (
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
            <View style={{flex: 1, padding: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{...Fonts.h1}}>Memory Packs</Text>
                    <TouchableOpacity style={{height: '100%', width: 22}} onPress={onCreateMemoryPackPressed}>
                        <Text style={{fontSize: 30}}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {memoryPacks.map((memoryPack, i) => {
                        let onPress = ()=>onSelectMemoryPack(i);
                        return (<MemoryPackItem onPress={onPress} memoryPack={memoryPack} key={`${i}`}/>);
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};


import { setCurrentMemoryPack } from '../redux/verse-chunk/verse-chunk-actions';
import { memoryPacksDateSorted } from '../redux/verse-chunk/verse-chunk-selectors';

const mapStateToProps = (state) => ({
    memoryPacks: memoryPacksDateSorted(state),
});
const mapDispatchToProps = {
    setCurrentMemoryPack
};

export default connect(mapStateToProps, mapDispatchToProps)(MemoryPacksScreen);
