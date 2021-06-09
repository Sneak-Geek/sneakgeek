import React from 'react';
import {Dimensions, FlatList} from 'react-native';
import Shimmer from 'react-native-shimmer-placeholder';
import _ from 'lodash';

export class ShimmerLoadList extends React.Component {
  private readonly imageShimmerSize = 100;
  private readonly paddingVertical = 20;
  private numRow: number;

  public constructor(props: {}) {
    super(props);
    this.numRow =
      Dimensions.get('screen').height /
      (this.imageShimmerSize + this.paddingVertical * 2);
  }

  public render(): JSX.Element {
    return (
      <FlatList
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        data={_.range(0, this.numRow)}
        renderItem={(): JSX.Element => this._renderChildItem()}
        keyExtractor={(item): string => item.toString()}
      />
    );
  }

  private _renderChildItem(): JSX.Element {
    return (
      <Shimmer
        height={this.imageShimmerSize}
        width={Dimensions.get('screen').width - this.paddingVertical}
        style={{marginVertical: 10, alignSelf: 'center'}}
        autoRun={true}
      />
    );
  }
}
