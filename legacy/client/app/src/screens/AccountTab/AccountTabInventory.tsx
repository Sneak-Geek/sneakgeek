import React from 'react';
import { View } from 'react-native';
import { getDependency, getToken } from 'utilities';
import { IInventoryService, FactoryKeys, Inventory } from 'business';

type Props = {};

type State = {
  inventories: Inventory[];
};

export class AccountTabInventory extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      inventories: []
    };
  }

  public componentDidMount(): void {
    this._getInventories();
  }

  private async _getInventories() {
    const token = getToken();
    const inventoryService = getDependency<IInventoryService>(FactoryKeys.IInventoryService);
    const inventories = await inventoryService.getInventories(token);
    this.setState({inventories});
  }

  render(): JSX.Element {
      return <View />;
  }
}