//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import * as React from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Shoe } from "../../../Shared/Model";
import { ShoeCard } from "../../../Shared/UI";
import { connect } from "react-redux";
import { IAppState } from "../../../Store";
import { NavigationActions } from "react-navigation";
import { RouteNames } from "../../../Navigation";

interface Props {
  shoes?: Shoe[];
  brand?: string;
  modalData?: { brand: string };
  goToShoeDetail: (shoe: Shoe) => void;
}

export class ShoesByBrandModal extends React.Component<Props> {
  static ModalName: string = "ShoesByBrandModal";

  public /** override */ render(): JSX.Element | null {
    const { modalData, shoes } = this.props;
    const brand = modalData && modalData.brand ? modalData.brand : "Nike";
    if (shoes) {
      const showShoes = shoes
        .filter(s => s.brand.toLowerCase() === brand.toLowerCase())
        .slice(0, 40);

      return (
        <SafeAreaView style={styles.modalContainer}>
          <FlatList
            style={{ flex: 1 }}
            data={showShoes}
            keyExtractor={(_data, index) => index.toString()}
            renderItem={({ item }) => (
              <ShoeCard shoe={item} onPress={() => this.props.goToShoeDetail(item)} />
            )}
            numColumns={2}
          />
        </SafeAreaView>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    marginVertical: 50,
    marginHorizontal: 20,
    borderRadius: 8,
    flex: 1
  }
});

export const ShoesByBrandModalContainer = connect(
  (state: IAppState) => ({
    shoes: state.AppContentState.shoes,
    modalData: state.ModalState.modalData
  }),
  (dispatch: Function) => ({
    goToShoeDetail: (shoe: Shoe) =>
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.ShoeDetail,
          params: { shoe }
        })
      )
  })
)(ShoesByBrandModal);
