import React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { createStackNavigator } from "react-navigation";

const brands = [
  "Nike",
  "adidas",
  "Jordan",
  "Vans",
  "New Balance",
  "Puma",
  "Reebok",
  "Converse",
  "Under Armour",
  "Fila",
  "Balenciaga",
  "Timberland",
  "Yeezy",
  "Louis Vuitton",
  "Dr. Martens",
  "BAPE",
  "OFF-WHITE",
  "FEAR OF GOD",
  "Gucci",
  "Air Jordan",
  "A Bathing Ape"
];

export default class Main extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={brands}
            keyExtractor={(itm, idx) => idx.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <Button title={item} style={{ margin: 5 }} onPress={() => this.navigateTo(item)} />
            )}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }

  navigateTo(brand) {
    this.props.navigation.navigate({
      routeName: "Brand",
      params: { brand }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
