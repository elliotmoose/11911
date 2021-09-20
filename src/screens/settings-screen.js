import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';

const headerHeight = 35;
const bibleCopyrightNotice = `Scripture quotations taken from The Holy Bible, New International Version® NIV®
Copyright © 1973 1978 1984 2011 by Biblica, Inc. TM
Used by permission. All rights reserved worldwide.`
const SettingsScreen = ({fontScale, setFontScale}) => {

    return <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'always', top: 'never'}}>
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: headerHeight }}>
                <Text allowFontScaling={false} style={{ ...Fonts.h1, lineHeight: headerHeight, color: Colors.black }}>Settings</Text>
                <View style={{ flex: 1 }} />
            </View>

            <View style={{height: 120, justifyContent: 'space-between', marginTop: 14}}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={{resizeMode: 'contain', height: 20, width: 20, marginHorizontal: 6}} source={Images.fonts}/>
                    <Text style={{...Fonts.alternate}}>Font Size</Text>
                </View>
                <Text style={{...Fonts.scaled(fontScale, Fonts.primary), textAlign: 'center'}}>Change the font size for verses</Text>
                <Slider 
                style={{marginHorizontal: 10}}
                    step={0.2} 
                    minimumValue={0.6}
                    maximumValue={1.4}
                    value={fontScale}
                    onValueChange={(val)=>setFontScale(val)}
                    />
            </View>
            <View style={{flex: 1}}/>
            <Text style={{textAlign: 'center', ...Fonts.primary, ...Fonts.small, color: Colors.darkgray}}>{bibleCopyrightNotice}</Text>
        </View>
    </SafeAreaView>
};


import { setFontScale } from '../redux/preferences/prefs-actions';

const mapStateToProps = (state) => ({
    fontScale: state.prefs.fontScale,
});

const mapDispatchToProps = {
    setFontScale
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);