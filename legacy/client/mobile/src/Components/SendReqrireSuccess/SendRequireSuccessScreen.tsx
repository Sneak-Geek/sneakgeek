import * as React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Image } from 'react-native';
import {
    StackActions,
    NavigationScreenProps,
} from "react-navigation";
import * as Assets from "../../Assets";

export class SendRequireSuccessScreen extends React.Component {

    static navigationOptions = (transitionProp: NavigationScreenProps) => ({
        headerStyle: ({
            borderBottomWidth: 0,
        })
        ,
        headerLeft: (
            <TouchableOpacity style={{ paddingLeft: 26 }} onPress={() => transitionProp.navigation.dispatch(StackActions.popToTop())}>
                <Text style={styles.titleCancel}>Đóng</Text>
            </TouchableOpacity>
        ),
    });

    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    position: "relative",
                    backgroundColor: 'white'
                }}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Yêu cầu của bạn đã được gửi!</Text>
                    <Text style={styles.descrip}>{`Cảm ơn bạn đã liên hệ với chúng tôi.\nChúng tôi sẽ liên hệ lại với bạn trong\nthời gian sớm nhất`}</Text>
                <Image source={Assets.Icons.SuccessLogo} style={styles.logo}/>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    titleCancel: {
        color: '#007AFF',
        fontSize: 24,
        fontFamily: 'RobotoCondensed-Regular',

    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 80
    },
    logo: {
        width: 96,
        height: 96,
        resizeMode: 'contain',
        marginTop: 56
    },
    title: {
        fontSize: 24,
        fontFamily: 'RobotoCondensed-Regular',
        lineHeight: 28,
        paddingBottom: 26,
    },
    descrip: {
        fontSize: 14,
        fontFamily: 'RobotoCondensed-Regular',
        lineHeight: 16,
        textAlign: 'center'
    }
})