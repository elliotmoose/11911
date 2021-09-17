import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Fonts from '../constants/fonts';

export default function SwipableList({data, renderItem, actions: {left: leftActions=[], right: rightActions=[]}, actionItemSize=75, ...props}){
    return <SwipeListView 
        data={data}
        renderItem={renderItem}
        renderHiddenItem={ (data, rowMap) => {
            return <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-end', backgroundColor: rightActions[0]?.color}}>
                {rightActions.map((action, i)=>{
                    return <TouchableOpacity key={`${i}`} style={{...styles.rowButton, backgroundColor: action.color}} onPress={()=>{
                        action.callback(data.item);
                        rowMap[data.item.key].closeRow();
                    }}>
                        <Text style={styles.rowText}>{action.text}</Text>
                    </TouchableOpacity>
                })}
            </View>
        }}
        
        rightOpenValue={-(actionItemSize * rightActions.length)}
        leftOpenValue={-(actionItemSize * leftActions.length)}
        disableRightSwipe={leftActions.length == 0}
        disableLeftSwipe={rightActions.length == 0}
        recalculateHiddenLayout={true}
        {...props}
    />
}


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