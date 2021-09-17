import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import MemoryPackItem from '../components/memory-pack-item';
import SwipableList from '../components/swipable-list';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';

const MemoryPacksScreen = ({ navigation, setCurrent, memoryPacks, deleteMemoryPack }) => {

    function onSelectMemoryPack(memoryPackId) {
        setCurrent(null, memoryPackId);
        navigation.goBack();
    }

    function onCreateMemoryPackPressed() {
        navigation.navigate('AddMemoryPack');
    }

    const actions = {
        right: [
            {
                color: Colors.lightgray, 
                text: 'Edit', 
                callback: (item)=>navigation.navigate('EditMemoryPack', {memoryPackId: item.key})
            },
            {
                color: Colors.red, 
                text: 'Delete', 
                callback: (item)=>deleteMemoryPack(item.key)
            },
        ],
        left: [],
    }

    return (
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20}}>
                    <Text style={{...Fonts.h1}}>Memory Packs</Text>
                    <TouchableOpacity style={{height: '100%', width: 22}} onPress={onCreateMemoryPackPressed}>
                        <Text style={{fontSize: 30}}>+</Text>
                    </TouchableOpacity>
                </View>
                <SwipableList 
                    data={memoryPacks.map((pack, i)=>({key: pack.id, pack}))}
                    renderItem={ (data, rowMap) => {
                        let memoryPack = data.item.pack;
                        let memoryPackId = memoryPack.id;
                        let onPress = ()=>onSelectMemoryPack(memoryPackId);
                        return (<MemoryPackItem onPress={onPress} memoryPack={memoryPack} key={data.item.key}/>);
                    }}
                    actions={actions}
                />
            </View>
        </SafeAreaView>
    );
};


import { setCurrent, deleteMemoryPack } from '../redux/verse-chunk/verse-chunk-actions';
import { memoryPacksDateSorted } from '../redux/verse-chunk/verse-chunk-selectors';

const mapStateToProps = (state) => ({
    memoryPacks: memoryPacksDateSorted(state),
});
const mapDispatchToProps = {
    setCurrent,
    deleteMemoryPack
};

const styles = StyleSheet.create({
    rowButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%',
        backgroundColor: 'red'
    },
    rowText: {
        color: 'white',
        ...Fonts.alternate,
        fontSize: 12
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MemoryPacksScreen);
