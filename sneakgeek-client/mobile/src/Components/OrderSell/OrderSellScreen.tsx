import * as React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Text } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import {
    StackActions,
    NavigationScreenProps,
} from "react-navigation";
import * as Assets from "../../Assets";
import { RouteNames } from "../../Navigation";

export class OrderSellScreen extends React.Component {

    static navigationOptions = (transitionProp: NavigationScreenProps) => ({
        title: "Bán sản phẩm",
        headerLeft: (
            <Icon
                type={"ionicon"}
                name={"ios-arrow-back"}
                size={28}
                containerStyle={{ marginLeft: 10 }}
                onPress={() => transitionProp.navigation.dispatch(StackActions.pop({ n: 1 }))}
            />
        ),
        headerRight: (
            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => transitionProp.navigation.dispatch(StackActions.push({routeName: RouteNames.TrackingSell}))}>
                <Image source={Assets.Icons.Edit} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
            </TouchableOpacity>
        ),
    });

    public constructor(props: any) {
        super(props);
        this.state = {
            step: 1
        };
    }

    public render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <ScrollView>
                        {this.renderShoe()}
                        {this.renderInfo()}
                    </ScrollView>
                    {this.renderButton()}
                </View>
            </SafeAreaView>
        )
    }

    private renderShoe() {
        return (
            <View style={styles.topContentContainer}>
                <View style={styles.imgContainer}>
                    <Image style={styles.image} source={{ uri: 'https://images.timberland.com/is/image/timberland/A228P001-HERO?$PDP-FULL-IMAGE$' }} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                        PHARELL X BILLIONAIRE BOYS CLUB X NMD HUMAN RACE TRAIL BLUEE PLAID
                    </Text>
                    <Text style={[styles.title, { fontSize: 16 }]}>
                        SKU: EF3326
                    </Text>
                </View>
            </View>
        );
    }

    private renderInfo() {
        return (
            <View style={styles.middleContainer}>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle}>Giá đăng</Text>
                        <Text style={styles.descrip}>VND 2.440.500</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subTitle, { textAlign: 'right' }]}>Giá gía đề nghị</Text>
                        <Text style={[styles.descrip, { textAlign: 'right' }]}>-</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle}>Thời gian còn lại</Text>
                        <Text style={styles.descrip}>18 giờ 8 phút</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subTitle, { textAlign: 'right' }]}>Tình trạng</Text>
                        <Text style={[styles.descrip, { textAlign: 'right', color: '#007AFF' }]}>Đã xác thực</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle}>Mã đơn hàng</Text>
                        <Text style={styles.descrip}>ABC1234</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle}>Miêu tả</Text>
                        <Text style={styles.descrip}>Cỡ 8.5, Đã sử dụng, Nguyên hộp mới, Ố vàng</Text>
                    </View>
                </View>
            </View>
        )
    }

    private renderButton() {
        return (
            <Button
                title="Huỷ giao dịch"
                buttonStyle={styles.authButtonContainer}
                titleStyle={{
                    fontSize: 20,
                    fontFamily: 'RobotoCondensed-Regular',
                }}
            />
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
    },
    topContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 24,
        paddingRight: 14,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    imgContainer: {
        width: 78,
        height: 78,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 78,
        height: 78,
        resizeMode: 'cover',
    },
    titleContainer: {
        flex: 1,
        paddingLeft: 17,
        paddingBottom: 7,
    },
    title: {
        fontFamily: 'RobotoCondensed-Regular',
        fontSize: 14,
        paddingTop: 20
    },
    middleContainer: {
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 17,
    },
    subTitle: {
        fontFamily: 'RobotoCondensed-Regular',
        fontSize: 16,
        opacity: 0.6
    },
    descrip: {
        fontFamily: 'RobotoCondensed-Regular',
        fontSize: 20,
        paddingTop: 8
    },
    authButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: Assets.Styles.ButtonHeight,
        backgroundColor: '#FF2D55'
    }
})