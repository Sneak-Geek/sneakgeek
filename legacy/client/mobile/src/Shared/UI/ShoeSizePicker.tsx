//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { Modal, SafeAreaView, View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Button, Icon } from "react-native-elements";
import { Text } from "./";
import * as Assets from "../../Assets";
import { Types, container } from "../../Config/Inversify";
import { IAppSettingsService } from "../../Service/AppSettingsService";
import { getInset } from "react-native-safe-area-view";

export interface ShoeSizePickerProps {
  visible: boolean;
  pickerTitle: string;
  owned?: Array<{ shoeSize: string; number: number }>;
  onTogglePicker: (exiting: boolean, owned: string | Array<{ shoeSize: string; number: number }>) => void;
  shouldRenderCounter: boolean;
}

export interface ShoeSizePickerState {
  pickedSize: string;
  owned: Array<{ shoeSize: string; number: number }>;
  buttonsLayout: Map<string, Coordinate>;
  isShowingCounter: boolean;
}

type Coordinate = {
  x: number;
  y: number;
};

const DimensionStyle = {
  triangleWidth: 20,
  triangleHeight: 40
};

export class ShoeSizePicker extends React.Component<ShoeSizePickerProps, ShoeSizePickerState> {
  private shoeSizes: string[] = [];
  private buttons: Map<string, View> = new Map();
  private indexMap: Map<string, number> = new Map();
  private numColumns: number = 4;
  private buttonSize = 60;

  public constructor(props: ShoeSizePickerProps) {
    super(props);
    this.state = {
      pickedSize: "",
      owned: this.props.owned || [],
      buttonsLayout: new Map(),
      isShowingCounter: false
    };
    const appSettingsService = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const appSettings = appSettingsService.getSettings();
    if (appSettings && appSettings.RemoteSettings) {
      this.shoeSizes = appSettings.RemoteSettings.shoeSizes.Adult;
      this._populateIndexMap();
    }
  }

  public /** override */ render(): JSX.Element {
    return (
      <Modal
        presentationStyle={"overFullScreen"}
        visible={this.props.visible}
        transparent={true}
        animationType={"fade"}
        animated={true}
      >
        <SafeAreaView style={styles.shoeSizesContainer} onLayout={_event => this._onShoeSizeButtonLayout()}>
          <Text.Title2 style={{ color: Assets.Styles.AppSecondaryColor, margin: 20 }}>
            {this.props.pickerTitle}
          </Text.Title2>
          {this.props.shouldRenderCounter && this._renderTriangleForCounter()}
          {this._renderShoeSizesContainer()}
          {this._renderShoeSizeSelectionButtons()}
        </SafeAreaView>
      </Modal>
    );
  }

  private _populateIndexMap() {
    this.shoeSizes.forEach((item, index) => {
      this.indexMap.set(item, index);
    });
  }

  private _renderTriangleForCounter() {
    const currentlyPicked = this.state.buttonsLayout.get(this.state.pickedSize);

    if (this.state.isShowingCounter && currentlyPicked) {
      return (
        <Image
          source={Assets.Icons.Up}
          style={[
            styles.counterDialogTriangle,
            {
              left: currentlyPicked.x + this.buttonSize / 2 - DimensionStyle.triangleWidth / 2,
              top: currentlyPicked.y + this.buttonSize
            }
          ]}
        />
      );
    }

    return null;
  }

  private _renderShoeSizesContainer(): JSX.Element {
    const numRows = this.shoeSizes.length / this.numColumns;
    const grids = [];

    for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
      const row = [];
      for (let colIdx = 0; colIdx < this.numColumns; colIdx++) {
        const currentIdx = rowIdx * this.numColumns + colIdx;
        const currentShoeSize = this.shoeSizes[currentIdx];
        row.push(
          <View
            ref={r => r && this.buttons.set(this.shoeSizes[currentIdx], r)}
            key={currentIdx.toString()}
            style={{ position: "relative" }}
          >
            <Button
              title={this.shoeSizes[currentIdx]}
              type={"clear"}
              style={[styles.buttonContainer, this._isSizeSelected(currentShoeSize) ? styles.buttonSelected : {}]}
              onPress={() => this._onShoeSizeSelected(currentShoeSize)}
              titleStyle={[
                Text.TextStyle.body,
                this._isSizeSelected(currentShoeSize)
                  ? { color: Assets.Styles.TextSecondaryColor }
                  : { color: Assets.Styles.TextPrimaryColor }
              ]}
            />
            {this._getSizeCount(currentShoeSize) > 0 && (
              <View style={styles.shoeBadgeCounter}>
                <Text.Footnote style={{ color: "white" }}>{this._getSizeCount(currentShoeSize)}</Text.Footnote>
              </View>
            )}
          </View>
        );
      }

      grids.push(
        <View key={rowIdx.toString()} style={{ flexDirection: "column" }}>
          <View style={styles.rowContainer}>{row}</View>
          {this.props.shouldRenderCounter &&
            this.state.isShowingCounter &&
            Math.floor((this.indexMap.get(this.state.pickedSize) as number) / this.numColumns) === rowIdx &&
            this._renderCounter()}
        </View>
      );
    }

    return <View style={{ flexDirection: "column" }}>{grids}</View>;
  }

  private _onShoeSizeSelected(currentShoeSize: string) {
    this.setState(prevState => {
      if (prevState.pickedSize !== currentShoeSize) {
        this.setState({
          pickedSize: currentShoeSize,
          isShowingCounter: true
        });
      } else {
        this.setState({
          pickedSize: "",
          isShowingCounter: false
        });
      }
    });
  }

  private _getSizeCount(shoeSize: string) {
    const sizeOwned = this.state.owned.filter(t => t.shoeSize === shoeSize);
    if (sizeOwned.length === 0) {
      return 0;
    }

    return sizeOwned[0].number;
  }

  private _isSizeSelected(shoeSize: string) {
    return this.state.pickedSize === shoeSize;
  }

  private _renderCounter() {
    const currentlyPicked = this.state.buttonsLayout.get(this.state.pickedSize);
    if (currentlyPicked) {
      return (
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={() => this._onToggleSizeCountCurrentSelected(false)}>
            <Icon name={"ios-remove"} type={"ionicon"} />
          </TouchableOpacity>
          <Text.Body>Số lượng: {this._getSizeCount(this.state.pickedSize)}</Text.Body>
          <TouchableOpacity onPress={() => this._onToggleSizeCountCurrentSelected(true)}>
            <Icon name={"ios-add"} type={"ionicon"} />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  private _onToggleSizeCountCurrentSelected(increase: boolean) {
    const owned = this.state.owned;
    const ownedIdx = this.state.owned.findIndex(t => t.shoeSize === this.state.pickedSize);

    const currentPickedSizeCount = this._getSizeCount(this.state.pickedSize);
    const newCount = increase ? currentPickedSizeCount + 1 : Math.max(0, currentPickedSizeCount - 1);

    if (ownedIdx >= 0) {
      owned[ownedIdx] = { shoeSize: this.state.pickedSize, number: newCount };
    } else {
      owned.push({ shoeSize: this.state.pickedSize, number: newCount });
    }

    this.setState({ owned });
  }

  private _renderShoeSizeSelectionButtons(): JSX.Element {
    return (
      <View style={styles.footerContainer}>
        <Button
          buttonStyle={{
            backgroundColor: "white",
            ...styles.footerButton
          }}
          title={"Đóng"}
          titleStyle={{ color: "black", ...Text.TextStyle.body }}
          onPress={() =>
            this.setState({ pickedSize: "" }, () => {
              this.props.shouldRenderCounter
                ? this.props.onTogglePicker(true, this.state.owned)
                : this.props.onTogglePicker(true, this.state.pickedSize);
            })
          }
        />
        <Button
          buttonStyle={{
            backgroundColor: "#1ABC9C",
            ...styles.footerButton
          }}
          title={"Xác nhận"}
          titleStyle={Text.TextStyle.body}
          onPress={() => {
            this.props.shouldRenderCounter
              ? this.props.onTogglePicker(false, this.state.owned)
              : this.props.onTogglePicker(false, this.state.pickedSize);

            this.setState({
              pickedSize: ""
            });
          }}
        />
      </View>
    );
  }

  private _onShoeSizeButtonLayout() {
    this.shoeSizes.forEach(item => {
      const button = this.buttons.get(item);
      if (button) {
        button.measure((_fx, _fy, _width, _height, px: number, py: number) => {
          this.setState(prevState => ({
            ...prevState,
            buttonsLayout: prevState.buttonsLayout.set(item, { x: px, y: py })
          }));
        });
      }
    });
  }
}

const styles = StyleSheet.create({
  shoeSizesContainer: {
    position: "relative",
    flex: 1,
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.9)",
    paddingHorizontal: 20
  },

  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },

  buttonSelected: {
    backgroundColor: "#1ABC9C"
  },

  footerButton: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 0,
    height: Assets.Styles.ButtonHeight
  },

  footerContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    paddingBottom: getInset("bottom")
  },

  counterDialogTriangle: {
    zIndex: 1,
    position: "absolute",
    tintColor: "white",
    width: DimensionStyle.triangleWidth,
    height: DimensionStyle.triangleHeight
  },

  counterContainer: {
    backgroundColor: "white",
    height: Assets.Styles.ButtonHeight,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10
  },

  shoeBadgeCounter: {
    position: "absolute",
    top: 2,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Assets.Styles.AppPrimaryColor,
    borderColor: "white",
    borderWidth: 1
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20
  }
});
