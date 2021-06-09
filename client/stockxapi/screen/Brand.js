import React from "react";
import { SafeAreaView, ScrollView, FlatList, Text } from "react-native";
import { ListItem } from "react-native-elements";

export default class Brand extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const brand = navigation.getParam("brand");
    return {
      headerTitle: brand
    };
  };

  brand = "";

  state = {
    brandTotal: 0,
    yearData: {}
  };

  componentDidMount() {
    this.brand = this.props.navigation.getParam("brand");
    fetch(`https://stockx.com/api/browse?productCategory=sneakers&brand=${this.brand}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          brandTotal: data.Pagination.total,
          yearData: data.Facets.year ? data.Facets.year : {}
        })
      }
      ).catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <ScrollView>
        <SafeAreaView>
          <Text>Total: {this.state.brandTotal} shoes</Text>
          <FlatList
            ListHeaderComponent={<Text>Shoes per year</Text>}
            data={Object.keys(this.state.yearData)}
            keyExtractor={(_itm, idx) => idx.toString()}
            renderItem={({ item }) => (
              <ListItem
                title={`Year: ${item} - ${this.state.yearData[item]} pairs released`}
                onPress={() =>
                  this.props.navigation.navigate({
                    routeName: "BrandByYear",
                    params: {
                      brand: this.brand,
                      year: item,
                      total: this.state.yearData[item]
                    }
                  })
                }
              />
            )}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}
