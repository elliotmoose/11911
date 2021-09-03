import React from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";
import Fonts from '../constants/fonts';
import RNPickerSelect from 'react-native-picker-select';
import { autocompleteBook, bookNames } from '../managers/bible-manager';
import { titleCase } from '../helpers/string-helper';
import Colors from '../constants/colors';

export default class LabeledAutocompleteInput extends React.Component {
    clear() {
        this.textInput.clear();
        // this.setState({pickerValue: ""});
    }

    state = {
        autocomplete: "",
        suggestion: "",
        value: ""
    }

    onChangeText(value) {
        //check to accept suggestion if user pressed whitespace
        let didAddChar = (value.length > this.state.value.length); 
        let lastCharIsWhitespace = (value[value.length-1] == " ");
        let hasAutocomplete = (this.state.autocomplete.length != 0);
        if(didAddChar && lastCharIsWhitespace && hasAutocomplete) {
            this.setState({value: this.state.suggestion});
            this.props.onChangeText(this.state.suggestion);
            this.props.goNextInput();
            return;
        }

        this.props.onChangeText(value);
        let autocomplete = autocompleteBook(value);
        let suggestion = (value + autocomplete.slice(value.length));
        this.setState({value, autocomplete, suggestion});
    }
    
    clearSuggestions(){
        this.setState({autocomplete: "", suggestion: ""});
    }

    render()
    {
        let {style, placeholder, outlineColor, autoFocus, ...otherProps} = this.props;
        return (<View style={{...style}} {...otherProps}>
            <Text style={{...Fonts.primary, ...Fonts.verysmall, color: outlineColor}}>{placeholder}</Text>
            <View style={{...styles.pickerContainer, borderColor: outlineColor}}>
                <TextInput ref={(ref)=>this.textInputBackground=ref} style={{...styles.textInput, borderColor: outlineColor, position: 'absolute', top: 0, left:0 , right: 0, bottom: 0, color: Colors.gray}} value={this.state.suggestion}/>
                <TextInput ref={(ref)=>this.textInput=ref} style={{...styles.textInput, borderColor: outlineColor}} autoFocus={autoFocus} onChangeText={this.onChangeText.bind(this)} value={this.state.value} onFocus={this.clearSuggestions.bind(this)} onBlur={this.clearSuggestions.bind(this)}/>
            </View>
        </View>);
    }
};

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        ...Fonts.primary,
        ...Fonts.small,
    },
});