import React from 'react';
import ReactNative from 'react-native';
import { View, StyleSheet } from 'react-native';
import { themes } from 'resources';
import { AppText } from './Text';
import Icon from 'react-native-ionicons'

type Props = {
    errorDescription: string;
}

const styles = StyleSheet.create({
    textStyle: {
        letterSpacing: -0.02,
        marginLeft: 5,
        color:themes.AppPrimaryColor,
        alignSelf:'center'
    },
    errorContainer: {
        flexDirection: 'row',
        marginBottom: 15
    }
});

export const WrongInputError = (props: Props) => {
    const {errorDescription} = props;

    let renderError: JSX.Element = errorDescription && errorDescription.length > 0 ?  <View style={styles.errorContainer}>
    <Icon style={styles.iconStyle} size={20}  name="close-circle-outline" color={themes.AppPrimaryColor}/>
    <AppText.SubCallout style={styles.textStyle}>{props.errorDescription}</AppText.SubCallout>
</View> : <View></View>

    return(
        renderError
    );
}