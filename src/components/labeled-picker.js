import React from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";
import Fonts from '../constants/fonts';
import RNPickerSelect from 'react-native-picker-select';
import { bookNames } from '../managers/bible-manager';
import { titleCase } from '../helpers/string-helper';

export default class LabeledPicker extends React.Component {
    clear() {
        this.picker.clear();
    }
    
    render()
    {
        let {style, placeholder, outlineColor, onChangeText, autoFocus, textAlign='center', ...otherProps} = this.props;
        return (<View style={{...style}} {...otherProps}>
            <Text style={{...Fonts.primary, ...Fonts.verysmall, color: outlineColor}}>{placeholder}</Text>
            <View style={{...styles.pickerContainer, borderColor: outlineColor, textAlign}}>
                <RNPickerSelect
                    onValueChange={onChangeText}
                    items={bookNames().map(name=>({label: titleCase(name), value: name}))}
                    placeholder=""
                    style={{inputIOS: {...Fonts.primary, ...Fonts.small, textAlign: 'center'}}}
                    ref={(ref)=>this.picker=ref}
                />
            </View>
        </View>);
    }
};

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    }
});