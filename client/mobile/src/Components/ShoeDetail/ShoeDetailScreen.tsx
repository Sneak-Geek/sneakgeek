// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  StatusBar
} from "react-native";
import { Account, getLatestPrice, Profile, Shoe } from "../../Shared/Model";
import { NavigationRoute, NavigationScreenProp, NavigationScreenProps, StackActions } from "react-navigation";
import { Icon } from "react-native-elements";
import styles from "./styles";
import { ShoeCard, Text } from "../../Shared/UI";
import StarRating from "react-native-star-rating";
import { Grid, LineChart, YAxis } from "react-native-svg-charts";
import * as Assets from "../../Assets";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import { StringUtils } from "../../Utilities";
import { AvailableSellOrdersPayload } from "../../Shared/Payload";
import { NetworkRequestState } from "../../Shared/State";
import { FeatureGates } from "../../Config/FeatureGates";
import { Styles } from "../../Assets";
import { TextStyle as AssetsTextStyle } from "../../Shared/UI/Text";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export interface IProps {
  navigation: NavigationScreenProp<NavigationRoute>;
  shoes: Shoe[];
  account: Account | null;
  profile?: Profile;
  routeIndex: number;
  availableSellOrdersState?: AvailableSellOrdersPayload;

  // dispatch props
  getAvailableOrders: (shoeId: string) => void;
  navigateToShoeDetailWithReset: (index: number, shoe: Shoe) => void;
  addOwnedShoe: (shoeId: string, owned: Array<{ shoeSize: string; number: number }>) => void;
  navigateToAuctionOrder: () => void;
  navigateToSellScreen: (shoe: Shoe) => void;
  navigateToBuySelection: (isOldCondition: boolean) => void;
  alert: (message: string) => void;
}

interface IState {
  favorited: boolean;
  bottomBuyerHeight?: number;
  isBuyTabClicked?: boolean;
  priceListIndex: number;
  ownedShoeModal: boolean;
  showModal: boolean;
}

export class ShoeDetailScreen extends React.Component<IProps, IState> {
  public static navigationOptions = (transitionProp: NavigationScreenProps) => ({
    title: "Chi tiết sản phẩm",
    headerTitleStyle: AssetsTextStyle.body,
    headerLeft: (
      <TouchableWithoutFeedback
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={() => transitionProp.navigation.dispatch(StackActions.pop({ n: 1 }))}
      >
        <Icon type={"ionicon"} name={"ios-arrow-back"} size={30} containerStyle={{ marginLeft: 10 }} />
      </TouchableWithoutFeedback>
    ),
    headerRight: <Icon type={"ionicon"} name={"ios-share"} size={28} containerStyle={{ marginRight: 10 }} />
  });

  private shoe: Shoe;
  private actionSheet: ActionSheet | null = null;

  constructor(props: IProps) {
    super(props);

    this.shoe = this.props.navigation.getParam("shoe");
    this.state = {
      favorited: false,
      priceListIndex: 0,
      ownedShoeModal: false,
      showModal: false,
      isBuyTabClicked: false
    };
  }

  public componentDidMount() {
    this.props.getAvailableOrders(this.shoe._id);
  }

  public /** override */ render(): JSX.Element {
    const bottomHeightStyle = this.state.bottomBuyerHeight ? { marginBottom: this.state.bottomBuyerHeight + 25 } : {};
    if (this.props.availableSellOrdersState?.state === NetworkRequestState.REQUESTING) {
      return <ActivityIndicator size={"large"} />;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Assets.Styles.AppSecondaryColorBlurred
        }}
      >
        <StatusBar hidden={false} barStyle={"default"} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: Styles.AppAccentColor }]} />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, ...bottomHeightStyle }}>
              {this._renderShoeImages()}
              {FeatureGates.EnableDaCo && this._renderUserBehaviorButtons()}
              {this._renderShoeTitle()}
              {this._renderShoeDescription()}
              {FeatureGates.EnablePriceChart && this._renderPriceGraph()}
              {this._renderShoeDetail()}
              {this._renderShoeRatings()}
              {this._renderRelatedShoes()}
              {this._renderActionSheet()}
            </View>
          </ScrollView>
          {this._renderButton()}
        </View>
      </SafeAreaView>
    );
  }

  private _renderShoeImages(): JSX.Element {
    return (
      <View style={styles.shoeImageContainer}>
        <Image source={{ uri: this.shoe.imageUrl }} style={{ width: "100%", aspectRatio: 2 }} resizeMode={"contain"} />
      </View>
    );
  }

  private _isShoeOwned(): boolean {
    if (!this.props.account) {
      return false;
    }

    const shoeOwned = this.props.profile
      ? this.props.profile.ownedShoes.findIndex(t => t.shoeId === this.shoe._id) >= 0
      : false;

    return shoeOwned;
  }

  private _renderUserBehaviorButtons(): JSX.Element {
    const [containerStyle, textStyle] = this._isShoeOwned()
      ? [{ backgroundColor: "black" }, { color: "white" }]
      : [{}, {}];
    return (
      <View style={styles.userButtonContainer}>
        <Icon
          type={"ionicon"}
          name={this.state.favorited ? "ios-heart" : "ios-heart-empty"}
          size={28}
          onPress={() => this.setState(s => ({ ...s, favorited: !s.favorited }))}
        />
        <View style={{ flexDirection: "row" }}>
          {this._renderSideButton("Đã có".toUpperCase(), { marginRight: 10, ...containerStyle }, textStyle, () =>
            this._addOwnedShoe()
          )}
          {this._renderSideButton("Bán".toUpperCase(), {}, {}, () => this.props.navigateToSellScreen(this.shoe))}
        </View>
      </View>
    );
  }

  private _addOwnedShoe() {
    this.setState({ ownedShoeModal: true });
  }

  private _renderShoeTitle(): JSX.Element {
    return (
      <Text.Title2 style={styles.shoeTitle} numberOfLines={2}>
        {this.shoe.title}
      </Text.Title2>
    );
  }

  private _renderSideButton(title: string, containerStyle: ViewStyle, textStyle: TextStyle, onPress: () => void) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[containerStyle, styles.smallButtonBorder]}>
          <Text.Subhead style={textStyle}>{title}</Text.Subhead>
        </View>
      </TouchableOpacity>
    );
  }

  private _renderShoeDescription(): JSX.Element | null {
    if (!this.shoe.description) {
      return null;
    }

    return <Text.Body style={{ marginHorizontal: 30 }}>{this.shoe.description}</Text.Body>;
  }

  private _renderPriceGraph(): JSX.Element | null {
    const data = [80, 81, 82, 80, 75, 85, 90, 95, 85, 92, 90, 98, 100];
    const contentInset = { top: 20, bottom: 20 };

    return (
      <View style={{ height: 200, flexDirection: "row", paddingHorizontal: 20 }}>
        <YAxis
          data={data}
          contentInset={contentInset}
          svg={{
            fill: "grey",
            fontSize: 10
          }}
          numberOfTicks={5}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={data}
          svg={{
            stroke: Assets.Styles.AppPrimaryColor,
            strokeWidth: 3,
            strokeLinecap: "round"
          }}
          contentInset={contentInset}
          numberOfTicks={5}
        >
          <Grid />
        </LineChart>
      </View>
    );
  }

  private _renderShoeDetail(): JSX.Element {
    const fieldMapping = new Map<string, string>([
      ["title", "Tên sản phẩm"],
      ["colorway", "Màu chủ đạo"],
      ["brand", "Hãng"],
      ["category", "Phân khúc"]
    ]);
    const views: JSX.Element[] = [];
    fieldMapping.forEach((value: string, key: string) =>
      views.push(
        <View style={styles.infoRow}>
          <Text.Subhead style={{ color: "gray" }}>{value.toUpperCase()}</Text.Subhead>
          <Text.Body style={{ maxWidth: "60%", textAlign: "right" }} numberOfLines={2}>
            {this.shoe[key]}
          </Text.Body>
        </View>
      )
    );
    return <View style={{ paddingHorizontal: 20 }}>{views}</View>;
  }

  private _renderShoeRatings(): JSX.Element {
    const starColor: string = Assets.Styles.AppPrimaryColor;
    return (
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
        <View style={styles.ratingContainer}>
          <Text.Headline>{"Đánh giá sản phẩm".toUpperCase()}</Text.Headline>
          <Text.Headline style={{ color: Assets.Styles.AppPrimaryColor }}>3.5/5</Text.Headline>
        </View>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={styles.reviewTitleContainer}>
            <Text.Footnote style={{ textAlign: "center", fontWeight: "normal" }}>Hoàng Phạm</Text.Footnote>
            <StarRating
              disabled={true}
              maxStars={5}
              starSize={17}
              rating={3.5}
              emptyStarColor={starColor}
              fullStarColor={starColor}
              starStyle={{ marginHorizontal: 2 }}
            />
          </View>
          <Text.Body numberOfLines={2} style={{ color: "darkgray" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text.Body>
        </View>
        <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 10 }}>
          <Text.Body style={{ color: Assets.Styles.AppPrimaryColor }}>Xem thêm</Text.Body>
        </TouchableOpacity>
      </View>
    );
  }

  private _renderRelatedShoes(): JSX.Element {
    const { shoes, routeIndex } = this.props;
    const shoesData = shoes.length === 0 ? [] : shoes.slice(0, 5);
    return (
      <View>
        <Text.Headline style={{ margin: 20 }}>{"Sản phẩm liên quan".toUpperCase()}</Text.Headline>
        <FlatList
          horizontal={true}
          data={shoesData}
          keyExtractor={(shoe: Shoe, _: number) => shoe.title}
          renderItem={({ item }) => (
            <ShoeCard shoe={item} onPress={() => this.props.navigateToShoeDetailWithReset(routeIndex, item)} />
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  private _renderButton() {
    return (
      <View style={{ flexDirection: "row", backgroundColor: "black" }}>
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: "white", marginVertical: 8 }}>
          <TouchableOpacity style={styles.authButtonContainer} onPress={this._onGetBuyOptions.bind(this)}>
            <Image source={Assets.Icons.Buy} style={styles.icon} />
            <Text.Headline style={{ color: "white", fontSize: 17 }}>Mua</Text.Headline>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, borderLeftWidth: 1, borderColor: "white", marginVertical: 8 }}>
          <TouchableOpacity
            style={styles.authButtonContainer}
            onPress={() => this.props.navigateToSellScreen(this.shoe)}
          >
            <Image source={Assets.Icons.Sell} style={styles.icon} />
            <Text.Headline style={{ color: "white", fontSize: 17 }}>Bán</Text.Headline>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  private _onGetBuyOptions() {
    if (
      !this.props.availableSellOrdersState ||
      !this.props.availableSellOrdersState?.sellOrders ||
      this.props.availableSellOrdersState?.sellOrders?.length === 0
    ) {
      this.props.alert("Hiện tại chưa có trên thị trường, xin vui lòng thử lại");
    } else {
      this.actionSheet?.show();
    }

    return;
  }

  private _renderActionSheet() {
    const availableOptions = this.props.availableSellOrdersState?.sellOrders || [];
    const newOrderPrice = availableOptions
      .filter(t => t.shoeCondition === "Mới")
      .sort((x, y) => getLatestPrice(x) - getLatestPrice(y))[0];

    const oldOrderPrice = availableOptions
      .filter(t => t.shoeCondition !== "Mới")
      .sort((x, y) => getLatestPrice(x) - getLatestPrice(y))[0];

    const options: Array<{ title: string; onPress: () => void; isCancel: boolean; price?: number }> = [];

    if (newOrderPrice) {
      options.push({
        title: "Mua mới",
        onPress: () => this.props.navigateToBuySelection(false),
        isCancel: false,
        price: getLatestPrice(newOrderPrice)
      });
    }

    if (oldOrderPrice) {
      options.push({
        title: "Mua cũ",
        onPress: () => this.props.navigateToBuySelection(true),
        isCancel: false,
        price: getLatestPrice(oldOrderPrice)
      });
    }

    if (oldOrderPrice || newOrderPrice) {
      options.push({
        title: "Đặt giá",
        onPress: () => {},
        isCancel: false
      });
    }

    if (options.length !== 0) {
      options.push({ title: "Huỷ", onPress: () => {}, isCancel: true });
    }

    return (
      <ActionSheet
        styles={{
          buttonBox: {
            paddingVertical: 5,
            height: 60
          }
        }}
        ref={r => (this.actionSheet = r)}
        title={<Text.Callout>Mua sản phẩm</Text.Callout>}
        options={options.map((t, idx) => (
          <View key={idx} style={{ alignItems: "center", justifyContent: "center" }}>
            <Text.Title2 style={{ marginBottom: 5 }}>{t.title}</Text.Title2>
            {t.price && <Text.Callout>Giá thấp nhất {StringUtils.toCurrencyString(t.price.toString())}</Text.Callout>}
          </View>
        ))}
        cancelButtonIndex={options.findIndex(t => t.isCancel)}
        onPress={idx => options[idx]?.onPress()}
      />
    );
  }
}
