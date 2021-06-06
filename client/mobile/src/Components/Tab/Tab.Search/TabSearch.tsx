// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as React from "react";
import { FlatList, NavigationRoute, NavigationScreenOptions, NavigationScreenProp, ScrollView } from "react-navigation";
import {
  Image,
  Keyboard,
  Modal,
  NativeSyntheticEvent,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Icon, Input } from "react-native-elements";
import { BlurView } from "@react-native-community/blur";
import { Shoe } from "../../../Shared/Model";
import { CustomPicker, ShoeCard, Text } from "../../../Shared/UI";
import { SearchShoePayload } from "../../../Shared/Payload";
import * as Assets from "../../../Assets";
import { IAppSettingsService } from "../../../Service/AppSettingsService";
import { container, Types } from "../../../Config/Inversify";
import { TextStyle } from "../../../Shared/UI/Text";
import { NetworkRequestState } from "../../../Shared/State";

export interface ISearchScreenProps {
  shoes: Shoe[];
  searchResult: SearchShoePayload;
  navigation?: NavigationScreenProp<NavigationRoute>;

  onShoeClick: (forSell: boolean, shoe: Shoe) => void;
  search: (key: string) => void;
  navigateToShoeRequire: (shoeName: string) => void;
}

interface ISearchScreenState {
  searchKey: string;
  searchFocus: boolean;
  shouldRenderTopShoes: boolean;
  shouldOpenSell: boolean;
  showModal: boolean;
  fillPrice: string;
  fillGender: string;
  fillCondition: string;
  typeModal: string;
  brand: string[];
  isModalOpen: boolean;
  shoeSize: string;
  [key: string]: any;
}

export default class TabSearch extends React.Component<ISearchScreenProps, ISearchScreenState> {
  public static navigationOptions: NavigationScreenOptions = {
    tabBarIcon: ({ tintColor }) => {
      tintColor = tintColor as string;
      return <Icon type={"ionicon"} name="md-search" size={28} color={tintColor} />;
    }
  };

  private appSettings: IAppSettingsService = container.get<IAppSettingsService>(Types.IAppSettingsService);
  private remoteSettings = this.appSettings.getSettings().RemoteSettings;

  private _searchInputComponent: Input | null = null;
  private isForSell: boolean = false;

  private dataFill = [
    {
      data: ["Giá (Thấp - Cao)", "Giá (Cao - Thấp)", "Độ Hot", "Đánh giá tốt"],
      title: "SẮP XẾP THEO",
      stateName: "fillPrice"
    },
    { data: this.remoteSettings && this.remoteSettings.genders, title: "GIỚI TÍNH", stateName: "fillGender" },
    { data: ["Mới", "Cũ"], title: "TÌNH TRẠNG SỬ DỤNG", stateName: "fillCondition" }
  ];

  private dataOption = [
    { title: "CỠ GIÀY", stateName: "shoeSize", onPressItem: () => this.setState({ isModalOpen: true }) },
    { title: "THUƠNG HIỆU", stateName: "brand", onPressItem: () => this.setState({ typeModal: "brand" }) }
  ];

  public constructor /** override */(props: any) {
    super(props);
    this.isForSell = this.props.navigation ? this.props.navigation.getParam("isForSell") === true : false;
    this.state = {
      searchKey: "",
      searchFocus: false,
      shouldRenderTopShoes: true,
      shouldOpenSell: this.isForSell,
      showModal: false,
      fillPrice: "Giá (Thấp - Cao)",
      fillGender: "men",
      fillCondition: "Mới",
      typeModal: "home",
      brand: [],
      isModalOpen: false,
      shoeSize: ""
    };
  }

  public /** override */ render(): React.ReactNode {
    const { searchResult } = this.props;
    const isSearchReady = searchResult.shoes?.length! > 0;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={false} barStyle={"default"} />
        <View style={{ zIndex: 1000 }}>
          {this._renderSearchBar()}
          {this._renderKeywordHeaderAndFilter()}
          {this._renderHotKeywords()}
        </View>
        {isSearchReady ? this._renderSearchResult() : this._renderEmptyResults()}
        <View style={styles.contentContainer}>{this.state.showModal && this._renderModal()}</View>
      </SafeAreaView>
    );
  }

  public componentDidUpdate(prevProps: ISearchScreenProps) {
    const isForSell = prevProps.navigation ? prevProps.navigation.getParam("isForSell") : false;
    if (typeof isForSell === "boolean" && isForSell !== this.state.shouldOpenSell) {
      this.setState({
        shouldOpenSell: isForSell
      });
    }
  }
  private _addBrand(item: string) {
    const newArr = this.state.brand;
    newArr.push(item);
    this.setState({ brand: newArr });
  }

  private _removeBrand(item: string) {
    const newArr = this.state.brand;
    const arr = newArr.filter(value => value !== item);
    this.setState({ brand: arr });
  }

  private _renderSearchBar(): React.ReactNode {
    return (
      <View style={{ position: "relative", zIndex: 1000 }}>
        <Input
          ref={refInput => (this._searchInputComponent = refInput)}
          onFocus={_ => this.setState({ searchFocus: true })}
          placeholder={"Tìm kiếm"}
          value={this.state.searchKey}
          leftIcon={<Icon type={"ionicon"} name={"md-search"} size={25} />}
          leftIconContainerStyle={{ marginRight: 20 }}
          rightIcon={
            this.state.searchFocus && (
              <Icon type={"ionicon"} name={"md-close"} size={25} onPress={this._toggleSearchFocus.bind(this)} />
            )
          }
          labelStyle={TextStyle.body}
          onChangeText={this._search.bind(this)}
          onSubmitEditing={this._onEndEditing.bind(this)}
        />
        {this.state.searchFocus && this._renderSearchContent()}
      </View>
    );
  }

  private _renderSearchContent(): React.ReactNode {
    const { searchResult } = this.props;
    return (
      <BlurView blurType={"light"} blurAmount={80} style={styles.searchContainer}>
        <FlatList
          onScroll={_ => Keyboard.dismiss()}
          keyboardShouldPersistTaps={"always"}
          data={searchResult.shoes || []}
          keyExtractor={(shoe, _) => shoe.title}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.onShoeClick(this.state.shouldOpenSell, item)}>
              <Text.Callout style={styles.searchResult}>{item.title}</Text.Callout>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "black",
            paddingBottom: 17,
            paddingLeft: 43
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigateToShoeRequire(this.state.searchKey)}>
            <Text.Body
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: Assets.Styles.AppPrimaryColor
              }}
            >
              Không thấy sản phẩm cần tìm?
            </Text.Body>
          </TouchableOpacity>
        </View>
      </BlurView>
    );
  }

  private _renderKeywordHeaderAndFilter(): React.ReactNode {
    return (
      <View style={styles.keywordContainer}>
        <Text.Subhead>Từ khoá hot</Text.Subhead>
        <TouchableOpacity onPress={() => this.setState({ showModal: !this.state.showModal })}>
          <Image source={Assets.Icons.Hamburger} style={{ width: 15, height: 15, resizeMode: "contain" }} />
        </TouchableOpacity>
      </View>
    );
  }

  private _renderHotKeywords(): React.ReactNode {
    const keywords = ["Air Jordan", "Nike Air", "Adidas X", "Nike Air Max", "Yeezy Boost White"];

    const buttons = keywords.map((k, idx) => (
      <TouchableWithoutFeedback key={idx} onPress={() => this._search(k)}>
        <View style={styles.keywordWrapper}>
          <Text.Body style={styles.keywordStyle}>{k}</Text.Body>
        </View>
      </TouchableWithoutFeedback>
    ));

    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {buttons}
      </ScrollView>
    );
  }

  private _toggleSearchFocus(shouldClearText: boolean = true): void {
    this.setState((prevState: ISearchScreenState) => {
      if (shouldClearText && prevState.searchFocus && this._searchInputComponent) {
        this._searchInputComponent.blur();
        this._searchInputComponent.clear();
      }

      return {
        ...prevState,
        searchFocus: !prevState.searchFocus
      };
    });
  }

  private _search(keyword: string): void {
    this.setState((prevState: ISearchScreenState) => {
      if (keyword.length > this.state.searchKey.length && keyword.length >= 3) {
        this.props.search(keyword);
      }

      return {
        ...prevState,
        searchKey: keyword,
        shouldRenderTopShoes: false
      };
    });
  }

  private _onEndEditing(_event: NativeSyntheticEvent<any>): void {
    this._toggleSearchFocus(false);
  }

  private _renderEmptyResults(): React.ReactNode {
    const text =
      this.props.searchResult.state === NetworkRequestState.NOT_STARTED
        ? "Hãy gõ tên hoặc hãng giày để tìm kiếm"
        : "Không tìm thấy kết quả nào";
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text.Subhead>{text}</Text.Subhead>
      </View>
    );
  }

  private _renderSearchResult(): JSX.Element {
    const { searchResult } = this.props;
    const shoes = searchResult.shoes ? searchResult.shoes : [];
    return (
      <FlatList
        data={shoes}
        keyExtractor={(_data, index) => index.toString()}
        renderItem={({ item }) => (
          <ShoeCard shoe={item} onPress={() => this.props.onShoeClick(this.state.shouldOpenSell, item)} />
        )}
        numColumns={2}
        style={{ marginTop: 10, marginBottom: 15 }}
      />
    );
  }

  private _renderModal(): React.ReactNode {
    return (
      <Modal
        presentationStyle={"overFullScreen"}
        visible={this.state.showModal}
        transparent={true}
        animationType={"fade"}
        animated={true}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState({ showModal: false })}
            style={{ height: 140, backgroundColor: "transparent" }}
          />
          {this.state.typeModal === "home" && (
            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)" }}>
                <View style={{ paddingLeft: 20, paddingTop: 37, flex: 1 }}>
                  {this._renderFill()}
                  {this._renderOption()}
                  {this._renderPickerModal()}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={{
                  paddingBottom: 23,
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.85)"
                }}
                activeOpacity={1}
              >
                <Text.Body style={{ fontSize: 20, color: "white" }}>Xem kết quả</Text.Body>
              </TouchableOpacity>
            </View>
          )}
          {this.state.typeModal === "brand" && this._renderBrandSelection()}
        </View>
      </Modal>
    );
  }

  private _renderFill() {
    return this.dataFill.map((item, index) => {
      return (
        <View key={index}>
          <Text.Title1 style={{ color: "white", fontSize: 14 }}>{item.title}</Text.Title1>
          <View style={{ flexDirection: "row", paddingTop: 20, paddingBottom: 37 }}>
            <ScrollView style={{ flex: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {item.data &&
                item.data.map((itemC, indexC) => {
                  return (
                    <TouchableOpacity
                      key={indexC}
                      style={[this.state[item.stateName] === itemC ? styles.buttonSelected : styles.button]}
                      onPress={() => this.setState({ [item.stateName]: itemC })}
                    >
                      <Text.Body style={this.state[item.stateName] === itemC ? styles.titleSelected : styles.title}>
                        {itemC}
                      </Text.Body>
                      {this.state[item.stateName] === itemC && (
                        <Image source={Assets.Icons.CheckMark} style={styles.icon} />
                      )}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      );
    });
  }

  private _renderOption() {
    return (
      <View style={{ paddingRight: 20 }}>
        {this.dataOption.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={item.onPressItem} style={styles.itemOptionContainer}>
              <Text.Title1 style={{ color: "white", fontSize: 14 }}>{item.title}</Text.Title1>
              <View>
                {this.state[item.stateName].length > 0 ? (
                  <Text.Body style={{ color: Assets.Styles.AppPrimaryColor }}>{this.state[item.stateName]}</Text.Body>
                ) : (
                  <Image source={Assets.Icons.RightArrow} style={{ width: 12, height: 20, resizeMode: "contain" }} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  private _renderPickerModal() {
    return (
      <CustomPicker
        visible={this.state.isModalOpen}
        options={this.remoteSettings ? this.remoteSettings.shoeSizes.Adult : []}
        optionLabelToString={item => item}
        onSelectPickerOK={(selectedValue: string) => {
          this.setState({ shoeSize: selectedValue, isModalOpen: false });
        }}
        onSelectPickerCancel={() => this.setState({ isModalOpen: false })}
      />
    );
  }

  private _renderBrandSelection() {
    return (
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)" }}>
        <TouchableOpacity
          style={{ width: 100, height: 44, justifyContent: "center", paddingLeft: 9 }}
          onPress={() => {
            this.setState({ typeModal: "home" });
          }}
        >
          <Image source={Assets.Icons.BackWhite} style={{ width: 12, height: 20 }} />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 20 }}>
          <Text.Headline style={{ fontSize: 14, color: "white" }}>Thương hiệu</Text.Headline>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 20,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderColor: "#C4C4C4"
            }}
          >
            <View style={{ flexDirection: "row", flex: 1 }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {this.state.brand.length > 0 &&
                  this.state.brand.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          marginRight: 5,
                          borderRadius: 3,
                          alignItems: "center",
                          backgroundColor: "white",
                          flexDirection: "row",
                          height: 28,
                          paddingHorizontal: 15
                        }}
                      >
                        <Text.Body>{item}</Text.Body>
                        <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => this._removeBrand(item)}>
                          <Image source={Assets.Icons.Close} style={{ width: 13, height: 13, resizeMode: "contain" }} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </ScrollView>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({ brand: [] });
              }}
              style={{
                borderRadius: 10,
                width: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white"
              }}
            >
              <Image source={Assets.Icons.Close} style={{ width: 10, height: 10, resizeMode: "contain" }} />
            </TouchableOpacity>
          </View>
          <View>
            {this.remoteSettings &&
              this.remoteSettings.shoeBrands.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.brand.indexOf(item) === -1) {
                        this._addBrand(item);
                      } else {
                        this._removeBrand(item);
                      }
                    }}
                    key={index}
                    style={{ paddingTop: 35, flexDirection: "row", alignItems: "center" }}
                  >
                    <Text.Body style={{ color: "white", flex: 1 }}>{item}</Text.Body>
                    {this.state.brand.indexOf(item) !== -1 && (
                      <Image
                        source={Assets.Icons.CheckMark}
                        style={{ tintColor: "white", width: 16, height: 12, resizeMode: "contain" }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    position: "relative",
    flex: 1,
    zIndex: 1000
  },

  keywordContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  searchContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "white",
    paddingTop: 20
  },

  keywordWrapper: {
    height: Assets.Styles.ButtonHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    marginLeft: 20
  },

  keywordStyle: {
    textAlign: "center"
  },

  searchResult: {
    marginVertical: 15,
    marginHorizontal: 20,
    fontSize: 14
  },

  buttonSelected: {
    width: Assets.Device.WIDTH / 2,
    backgroundColor: "white",
    borderRadius: 2,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15
  },
  titleSelected: {
    color: "black",
    fontSize: 14
  },
  button: {
    width: Assets.Device.WIDTH / 2,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 2,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15
  },
  title: {
    color: "white",
    fontSize: 14
  },
  icon: {
    position: "absolute",
    right: 6,
    width: 17,
    height: 13,
    resizeMode: "contain"
  },
  itemOptionContainer: {
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between"
  }
});
