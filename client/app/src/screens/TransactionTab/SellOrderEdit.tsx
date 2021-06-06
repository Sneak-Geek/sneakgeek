import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {ProductConditionExtra} from 'screens/Product/ProductConditionExtra';
import {PopulatedSellOrder, SellOrderEditInput} from 'business';
import {ProductSetPrice} from 'screens/Product/ProductSetPrice';
import {BottomButton} from 'screens/Shared';
import {themes, strings} from 'resources';

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingBottom: themes.RegularButtonHeight * 1.2,
  },
});

type Props = {
  order: PopulatedSellOrder;
  onUpdateOrder: (updatedOrder: SellOrderEditInput) => any;
};

type State = {
  updatedOrder: SellOrderEditInput;
};

export class SellOrderEdit extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      updatedOrder: {
        orderId: props.order._id,
      },
    };
  }

  public render(): JSX.Element {
    return (
      <View style={styles.rootContainer}>
        <ScrollView>
          <ProductConditionExtra
            order={this.props.order}
            onSetShoeHeavilyTorn={(isTorn): void =>
              this.onSetProductConditionState('isTorn', isTorn)
            }
            onSetShoeOtherDetail={(otherDetail): void =>
              this.onSetProductConditionState('otherDetail', otherDetail)
            }
            onSetShoeOutsoleWorn={(insoleWorn): void =>
              this.onSetProductConditionState('isOutsoleWorn', insoleWorn)
            }
            onSetShoeTainted={(tainted): void =>
              this.onSetProductConditionState('isTainted', tainted)
            }
            onSetShoeInsoleWorn={(insoleWorn): void =>
              this.onSetProductConditionState('isInsoleWorn', insoleWorn)
            }
          />
          <ProductSetPrice
            order={this.props.order}
            onSetShoePrice={(price: number): void => {
              this.setState({
                updatedOrder: {
                  ...this.state.updatedOrder,
                  sellPrice: price,
                },
              });
            }}
          />
        </ScrollView>
        <BottomButton
          onPress={(): void =>
            this.props.onUpdateOrder(this.state.updatedOrder)
          }
          title={strings.UpdateOrder}
          style={{backgroundColor: themes.AppPrimaryColor}}
        />
      </View>
    );
  }

  private onSetProductConditionState(stateName: string, value: any): void {
    this.setState({
      updatedOrder: {
        ...this.state.updatedOrder,
        productCondition: {
          ...this.state.updatedOrder.productCondition,
          [stateName]: value,
        },
      },
    });
  }
}
