import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { strings } from 'resources';
import { AppText } from 'screens/Shared';
import {images} from '../../resources'

type OwnProps = {
    email: string;
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        paddingHorizontal: 16
    },
    bodyTextStyle: {
        marginTop: 40
    },
    img: {
        width: 305, height: 244, marginTop: 160, alignSelf:'center'
    }
});

export const ForgotPasswordEmailSentScreen: React.FC<OwnProps> = ({email} : OwnProps) => {
    return (
        <View style={styles.root}>
            <AppText.Body style={styles.bodyTextStyle}>{strings.ResetPasswordLinkSent} {email}.</AppText.Body>
            <AppText.Body style={styles.bodyTextStyle}>{strings.ResetPasswordInstructions}</AppText.Body>
            <Image source={images.ForgotPasswordEmailSent} style={styles.img}/>
        </View>
    );
}