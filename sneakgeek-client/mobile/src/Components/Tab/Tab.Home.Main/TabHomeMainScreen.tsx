// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Shoe } from "../../../Shared/Model";
import { ShoeCard, Text } from "../../../Shared/UI";
import * as Assets from "../../../Assets";
import ViewPager from "@react-native-community/viewpager";
import { Icons } from "../../../Assets";
import { TextStyle } from "../../../Shared/UI/Text";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export interface ITabHomeMainScreenProps {
  shoes: Shoe[];
  fetchShoes: () => void;
  navigateToShoeDetail: (shoe: Shoe) => void;
  navigateToSeeMore: (title: string, shoes: Shoe[]) => void;
}

export interface ITabHomeMainScreenState {
  hotShoesCurrentPage: number;
  shoesRankingPage: number;
}

export class TabHomeMainScreen extends React.Component<ITabHomeMainScreenProps, ITabHomeMainScreenState> {
  public static navigationOptions = {
    title: "SneakGeek",
    headerLeft: <Image source={Icons.AppIcon} style={{ width: 40, height: 40 }} />,
    headerTitleStyle: {
      color: "white",
      textAlign: "left",
      ...TextStyle.title3
    },
    headerStyle: {
      backgroundColor: "black"
    }
  };

  private hotShoeViewPager: ViewPager | null = null;
  private hotShoesPageTimeout: NodeJS.Timeout | null = null;
  private shoesRankingViewPager: ViewPager | null = null;
  private shoesRankingPageTimeout: NodeJS.Timeout | null = null;
  private hotShoeSlidingInterval = 3500;
  private shoesRankingSlidingInterval = 5000;

  public constructor(props: ITabHomeMainScreenProps) {
    super(props);
    this.state = {
      hotShoesCurrentPage: 0,
      shoesRankingPage: 0
    };
  }

  public /** override */ componentDidMount() {
    if (this.props.shoes.length === 0) {
      this.props.fetchShoes();
    }
  }

  public /** override */ render() {
    if (this.props.shoes.length === 0) {
      return (
        <SafeAreaView style={StyleSheet.absoluteFill}>
          <StatusBar hidden={false} barStyle={"light-content"} />
          <ActivityIndicator />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={false} barStyle={"light-content"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, marginBottom: 15 }}>
            {this._renderTrendingShoes()}
            {this._renderUserCustomizeFeed()}
            {this._renderBanner(Icons.Banner, 320)}
            {this._renderByBrand("Nike", false)}
            {this._renderShoeChart()}
            {this._renderByBrand("adidas", false)}
            {this._renderBanner(Icons.AdBanner, 600)}
            {this._renderByBrand("Jordan", false)}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  public /** override */ componentWillUnmount() {
    if (this.hotShoesPageTimeout) {
      clearInterval(this.hotShoesPageTimeout);
    }

    if (this.shoesRankingPageTimeout) {
      clearInterval(this.shoesRankingPageTimeout);
    }
  }

  private _renderTrendingShoes() {
    const shoesData = this.props.shoes.length > 8 ? this.props.shoes.slice(20, 28) : [];

    if (shoesData.length === 0) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <Text.LargeTitle style={styles.sectionTitle}>Đang hot</Text.LargeTitle>
        <ViewPager
          ref={v => (this.hotShoeViewPager = v)}
          initialPage={0}
          scrollEnabled={true}
          showPageIndicator={false}
          style={{ flex: 1, width: "100%", minHeight: 300 }}
          pageMargin={10}
          orientation={"horizontal"}
          transitionStyle={"scroll"}
          onPageSelected={e => this.setState({ hotShoesCurrentPage: e.nativeEvent.position })}
          onLayout={_ => {
            this.hotShoesPageTimeout = setInterval(() => {
              const newPage = (this.state.hotShoesCurrentPage + 1) % shoesData.length;
              this.setState(
                {
                  hotShoesCurrentPage: newPage
                },
                () => this.hotShoeViewPager?.setPage(newPage)
              );
            }, this.hotShoeSlidingInterval);
          }}
        >
          {shoesData.map((t, i) => this._renderTrendingShoe(t, i))}
        </ViewPager>
        {this._renderDivider()}
      </View>
    );
  }

  private _renderDivider() {
    return <View style={styles.divider} />;
  }

  private _renderUserCustomizeFeed() {
    const { shoes } = this.props;
    const shoesData = shoes.length > 22 ? shoes.slice(32, 40) : [];

    return (
      <View style={{ flex: 1 }}>
        <Text.Title2 style={styles.subtitle}>Dành cho bạn</Text.Title2>
        <FlatList
          horizontal={true}
          data={shoesData}
          keyExtractor={(shoe: Shoe, _: number) => shoe.title}
          renderItem={({ item }) => <ShoeCard shoe={item} onPress={() => this.props.navigateToShoeDetail(item)} />}
          showsHorizontalScrollIndicator={false}
        />
        {/* {this._renderDivider()} */}
      </View>
    );
  }

  private _renderByBrand(brandName: string, shouldRenderDivider: boolean = true) {
    const shoesData =
      this.props.shoes.length > 0
        ? this.props.shoes.filter(s => s.brand.toLowerCase() === brandName.toLowerCase()).slice(0, 5)
        : [];

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => this.props.navigateToSeeMore(brandName, shoesData)}>
          <Text.Title2 style={styles.subtitle}>{brandName} - Nổi bật</Text.Title2>
        </TouchableOpacity>
        <FlatList
          style={{ marginTop: 10 }}
          horizontal={true}
          data={shoesData}
          keyExtractor={(shoe: Shoe, _: number) => shoe.title}
          renderItem={({ item }) => <ShoeCard shoe={item} onPress={() => this.props.navigateToShoeDetail(item)} />}
          showsHorizontalScrollIndicator={false}
        />
        {shouldRenderDivider && this._renderDivider()}
      </View>
    );
  }

  private _renderBanner(imgSource: number, height: number) {
    return (
      <View style={{ marginVertical: 20, position: "relative" }}>
        <Image source={imgSource} style={{ width: "100%", height }} resizeMode={"contain"} />
      </View>
    );
  }

  private _renderShoeChart(): JSX.Element | null {
    const data = this.props.shoes.length === 0 ? [] : this.props.shoes.slice(0, 5);
    if (data.length === 0) {
      return null;
    }

    return (
      <View
        style={{
          marginVertical: 15,
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderTopColor: "#BCBBC1",
          borderBottomColor: "#BCBBC1"
        }}
      >
        <Text.Title2 style={{ marginLeft: 20, marginTop: 20 }}>Bảng xếp hạng giày</Text.Title2>
        <ViewPager
          ref={v => (this.shoesRankingViewPager = v)}
          initialPage={0}
          scrollEnabled={true}
          showPageIndicator={false}
          style={{ flex: 1, width: "100%", marginVertical: 20, minHeight: 400 }}
          pageMargin={10}
          orientation={"horizontal"}
          transitionStyle={"scroll"}
          onPageSelected={e => this.setState({ shoesRankingPage: e.nativeEvent.position })}
          onLayout={_ => {
            this.shoesRankingPageTimeout = setInterval(() => {
              const newPage = (this.state.shoesRankingPage + 1) % 2;
              this.setState(
                {
                  shoesRankingPage: newPage
                },
                () => this.shoesRankingViewPager?.setPage(newPage)
              );
            }, this.shoesRankingSlidingInterval);
          }}
        >
          {this._renderRankingPage(data, 0)}
          {this._renderRankingPage(data, 1)}
        </ViewPager>
      </View>
    );
  }

  private _renderRankingPage(data: Shoe[], pageNum: number) {
    return (
      <View
        key={pageNum}
        style={{
          width: Dimensions.get("window").width,
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center"
        }}
      >
        {data.map((s, i) => (
          <TouchableWithoutFeedback key={i} onPress={() => this.props.navigateToShoeDetail(s)}>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, marginHorizontal: 20 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Assets.Styles.AppPrimaryColor,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text.Title2 style={{ color: "white" }}>{i + pageNum * 5 + 1}</Text.Title2>
              </View>
              <Image source={{ uri: s.imageUrl }} style={{ width: 120, aspectRatio: 2 }} resizeMode={"contain"} />
              <View style={{ flex: 1, flexWrap: "wrap", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <Text.Subhead numberOfLines={2} ellipsizeMode={"tail"}>
                  {s.title}
                </Text.Subhead>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  }

  private _renderTrendingShoe(shoe: Shoe, index: number) {
    return (
      <View style={styles.shoeCardListItem} key={index + 1}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigateToShoeDetail(shoe);
          }}
        >
          <Image source={{ uri: shoe.imageUrl, cache: "default" }} style={styles.shoeCard} resizeMode={"center"} />
          <Text.Headline numberOfLines={2} style={styles.shoeTitle} ellipsizeMode={"tail"}>
            {shoe.title}
          </Text.Headline>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  divider: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#BCBBC1",
    marginVertical: 20,
    marginHorizontal: 5
  },
  sectionTitle: {
    fontSize: 28,
    marginLeft: 15,
    marginVertical: 15
  },

  shoeCardListItem: {
    width: Dimensions.get("window").width,
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Assets.Styles.ButtonBorderRadius
  },

  shoeCard: {
    flex: 1,
    width: 300,
    height: 150,
    marginVertical: 5
  },
  shoeTitle: {
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 25,
    marginTop: 15
  },

  subtitle: {
    fontSize: 20,
    marginLeft: 20
  }
});
