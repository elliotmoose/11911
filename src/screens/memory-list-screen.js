import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import MemoryListItem from '../components/memory-list-item';
import Fonts from '../fonts';
import { setCurrentSegment, userSegments } from '../test-manager';

const MemoryListScreen = ({ navigation }) => {

    const [memoryList, setMemoryList] = useState(userSegments);

    function onSelectVerseSegment(index) {
        setCurrentSegment(memoryList[index]);
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
            <View style={{flex: 1, padding: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{...Fonts.h1}}>My Memory List</Text>
                    <TouchableOpacity style={{height: '100%', width: 22}}>
                        <Text style={{fontSize: 30}}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {memoryList.map((segment, i) => {
                        let onPress = ()=>onSelectVerseSegment(i);
                        return (<MemoryListItem onPress={onPress} segment={segment} key={`${i}`}/>);
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default MemoryListScreen;
