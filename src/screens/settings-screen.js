import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const headerHeight = 35;

export const SettingsScreen = (params) => {
    return <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: headerHeight }}>
                <Text allowFontScaling={false} style={{ ...Fonts.h1, lineHeight: headerHeight, color: Colors.black }}>Settings</Text>
                <View style={{ flex: 1 }} />
            </View>
        </View>
    </SafeAreaView>
};