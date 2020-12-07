// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { ITransactionState } from "../../Reducers";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { FlatList, NavigationRoute, NavigationScreenProp, NavigationScreenProps, StackActions } from "react-navigation";
import {
  ShoeConditionExtraInfoComponent,
  ShoeConditionRequiredInfoComponent,
  ShoeSellOrderSummaryComponent,
  ShoeSetPriceComponent
} from "./ChildComponents";
import { Icon } from "react-native-elements";
import styles from "./styles";
import { Text } from "../../Shared/UI";
import { Shoe, Transaction } from "../../Shared/Model";
import * as Assets from "../../Assets";
import { NetworkRequestState } from "../../Shared/State";

export interface ISellDetailScreenProps {
  navigation: NavigationScreenProp<NavigationRoute>;
  transactionState: ITransactionState;

  // dispatch props
  sellShoe: (sellOrder: Transaction) => void;
  showNotification: (notification: string) => void;
}

interface ISellDetailScreenState {
  sellOrderInfo: Transaction;
  currentChildComponentIndex: number;
}

interface ISellDetailChildren {
  render: () => JSX.Element;
  canProceed: () => boolean;
}

export class SellDetailScreen extends React.Component<ISellDetailScreenProps, ISellDetailScreenState> {
  public static navigationOptions = (transitionProps: NavigationScreenProps) => ({
    title: "Đăng sản phẩm",
    headerTitleStyle: Text.TextStyle.title3,
    headerLeft: (
      <Icon
        type={"ionicon"}
        name={"ios-arrow-back"}
        size={28}
        containerStyle={{ marginLeft: 10 }}
        onPress={() => transitionProps.navigation.dispatch(StackActions.pop({ n: 1 }))}
      />
    )
  });

  private shoe: Shoe;
  private detailComponentList: FlatList<ISellDetailChildren> | null = null;
  private childComponents: ISellDetailChildren[] = [];

  public constructor /** override */(props: ISellDetailScreenProps) {
    super(props);
    this.shoe = this.props.navigation.getParam("shoeForSell");
    this.state = {
      sellOrderInfo: {
        shoeId: this.shoe._id
      },
      currentChildComponentIndex: 0
    };

    this.childComponents = [
      {
        render: () => (
          <ShoeConditionRequiredInfoComponent
            key={0}
            onSetShoeSize={this._setShoeSize.bind(this)}
            onSetShoeCondition={this._setShoeCondition.bind(this)}
            onSetBoxCondition={this._setBoxCondition.bind(this)}
          />
        ),
        canProceed: () => {
          const { sellOrderInfo } = this.state;
          return (
            sellOrderInfo.shoeSize !== undefined &&
            sellOrderInfo.shoeCondition !== undefined &&
            sellOrderInfo.boxCondition !== undefined
          );
        }
      },
      {
        render: () => (
          <ShoeConditionExtraInfoComponent
            key={1}
            onSetShoeHeavilyTorn={this._setShoeHeavilyTorn.bind(this)}
            onSetShoeInsoleWorn={this._setShoeInsoleWorn.bind(this)}
            onSetShoeOutsoleWorn={this._setShoeOutsoleWorn.bind(this)}
            onSetShoeTainted={this._setShoeTainted.bind(this)}
            onSetShoeOtherDetail={this._setShoeOtherDetail.bind(this)}
          />
        ),
        canProceed: () => {
          return true;
        }
      },
      {
        render: () => (
          <ShoeSetPriceComponent
            key={2}
            onSetShoePrice={this._setShoePrice.bind(this)}
            onSetSellDuration={this._setSellDuration.bind(this)}
          />
        ),
        canProceed: () => {
          const { sellOrderInfo } = this.state;
          return sellOrderInfo.currentPrice !== undefined && sellOrderInfo.sellDuration !== undefined;
        }
      },
      {
        render: () => (
          <ShoeSellOrderSummaryComponent
            key={3}
            orderSummary={this.state.sellOrderInfo}
            onShoePictureAdded={(picUri: string) => {
              this.setState(prevState => {
                let pictures: string[] = prevState.sellOrderInfo.shoePictures || [];
                pictures = [...pictures, picUri];
                return {
                  sellOrderInfo: {
                    ...prevState.sellOrderInfo,
                    shoePictures: pictures
                  }
                };
              });
            }}
          />
        ),
        canProceed: () => {
          return true;
        }
      }
    ];
  }

  public componentDidUpdate(prevProps: ISellDetailScreenProps) {
    const currentState = this.props.transactionState.sellShoeState?.state;
    const prevState = prevProps.transactionState.sellShoeState?.state;

    if (prevState !== currentState && currentState === NetworkRequestState.SUCCESS) {
      this.props.showNotification(`Đã bán đôi ${this.shoe.title} thành công!`);
      this.props.navigation.dispatch(StackActions.pop({ n: 1 }));
    }

    if (prevState !== currentState && currentState === NetworkRequestState.FAILED) {
      this.props.showNotification("Đã xảy ra lỗi, xin vui lòng thử lại");
    }
  }

  public /** override */ render(): JSX.Element {
    return (
      <SafeAreaView style={{ flex: 1, position: "relative" }}>
        {this._renderActivityIndicator()}
        <View style={{ flex: 1 }}>
          {this._renderShoeDetail()}
          {this._renderSellerContent()}
          {this._renderNextButton()}
        </View>
      </SafeAreaView>
    );
  }

  public /** override */ componentWillUnmount() {
    this.props.navigation.setParams({ isForSell: false });
  }

  private _renderActivityIndicator() {
    const { transactionState } = this.props;
    const sellState = transactionState.sellOrderHistoryState?.state;
    return (
      <Modal
        presentationStyle={"overFullScreen"}
        visible={sellState === NetworkRequestState.REQUESTING}
        transparent={true}
        animationType={"fade"}
        animated={true}
      >
        <View style={[StyleSheet.absoluteFill, styles.activityIndicatorModalContainer]}>
          <View style={styles.acitivytIndicatorContainer}>
            <ActivityIndicator size={"large"} color={"white"} />
            <Text.Subhead style={{ color: Assets.Styles.AppSecondaryColor }}>Đang tải</Text.Subhead>
          </View>
        </View>
      </Modal>
    );
  }

  private _renderShoeDetail() {
    return (
      <View style={styles.shoeDetailContainer}>
        <Image
          source={{ uri: this.shoe.imageUrl, cache: "default" }}
          style={{ width: 120, aspectRatio: 2 }}
          resizeMode={"contain"}
        />
        <View style={styles.shoeDetailTextContainer}>
          <Text.Headline>{this.shoe.title}</Text.Headline>
          <Text.Footnote style={{ marginTop: 3 }} numberOfLines={2} ellipsizeMode={"tail"}>
            Colorway: {this.shoe.colorway.join(", ")}
          </Text.Footnote>
        </View>
      </View>
    );
  }
  private _renderSellerContent() {
    return (
      <FlatList
        ref={ref => (this.detailComponentList = ref)}
        bounces={false}
        style={{ flex: 1 }}
        horizontal={true}
        pagingEnabled={true}
        data={this.childComponents}
        renderItem={({ item }) => item.render()}
        alwaysBounceHorizontal={false}
        scrollEnabled={false}
        keyExtractor={(_item, idx) => idx.toString()}
      />
    );
  }

  private _setShoeSize(shoeSize: string) {
    this.setState(prevState => ({
      sellOrderInfo: {
        shoeSize,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setBoxCondition(boxCondition: string) {
    this.setState(prevState => ({
      sellOrderInfo: {
        boxCondition,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setShoeCondition(shoeCondition: string) {
    this.setState(prevState => ({
      sellOrderInfo: {
        shoeCondition,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setShoeHeavilyTorn(isHeavilyTorn: boolean) {
    this.setState(prevState => ({
      sellOrderInfo: {
        isHeavilyTorn,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setShoeInsoleWorn(isInsoleWorn: boolean) {
    this.setState(prevState => ({
      sellOrderInfo: {
        isInsoleWorn,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setShoeOutsoleWorn(isOutsoleWorn: boolean) {
    this.setState(prevState => ({
      sellOrderInfo: {
        isOutsoleWorn,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setShoeTainted(isShoeTainted: boolean) {
    this.setState(prevState => ({
      sellOrderInfo: {
        isShoeTainted,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setShoeOtherDetail(otherDetail: string) {
    this.setState(prevState => ({
      sellOrderInfo: {
        otherDetail,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setSellDuration(sellDuration: { duration: number; unit: string }) {
    this.setState(prevState => ({
      sellOrderInfo: {
        sellDuration,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _setShoePrice(price: number) {
    this.setState(prevState => ({
      sellOrderInfo: {
        currentPrice: price,
        ...prevState.sellOrderInfo
      }
    }));
  }

  private _renderNextButton() {
    const { width } = Dimensions.get("window");
    const fullWidth = { width };
    const halfWidth = { width: width / 2 };
    const currentChildComponent = this.childComponents[this.state.currentChildComponentIndex];
    const halfButtonCondition = this.state.currentChildComponentIndex > 0;
    const shouldRenderUpdate = this.state.currentChildComponentIndex === this.childComponents.length - 1;

    return (
      <View style={styles.bottomButtonContainer}>
        {halfButtonCondition && (
          <TouchableOpacity style={[styles.backButtonStyle, halfWidth]} onPress={() => this._scrollToNext(false)}>
            <Text.Body style={{ textAlign: "center", color: "black" }}>Quay lại</Text.Body>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextButtonStyle,
            !halfButtonCondition ? fullWidth : halfWidth,
            currentChildComponent.canProceed() ? { backgroundColor: "black" } : { backgroundColor: "gray" }
          ]}
          onPress={() => (shouldRenderUpdate ? this._sellShoe() : this._scrollToNext(true))}
        >
          <Text.Body style={{ textAlign: "center", color: "white" }}>
            {shouldRenderUpdate ? "Đăng sản phẩm" : "Tiếp tục"}
          </Text.Body>
        </TouchableOpacity>
      </View>
    );
  }

  private _scrollToNext(isNext: boolean) {
    const currentChildComponent = this.childComponents[this.state.currentChildComponentIndex];
    if (isNext && !currentChildComponent.canProceed()) {
      return;
    }

    if (this.detailComponentList) {
      const nextIndex = isNext
        ? Math.min(this.state.currentChildComponentIndex + 1, this.childComponents.length - 1)
        : Math.max(this.state.currentChildComponentIndex - 1, 0);

      this.setState(
        {
          currentChildComponentIndex: nextIndex
        },
        () => {
          this.detailComponentList?.scrollToIndex({
            index: nextIndex,
            animated: true
          });
        }
      );
    }
  }

  private _sellShoe() {
    this.props.sellShoe(this.state.sellOrderInfo);
  }
}
