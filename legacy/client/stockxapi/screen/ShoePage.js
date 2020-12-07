import React from "react";
import { FlatList, View, Image, Text, ActivityIndicator, Alert } from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import { Icon } from "react-native-elements";

export default class ShoePage extends React.Component {
  state = {
    shoes: [],
    isFetchingShoes: false,
    isPostingShoes: false,
    totalShoesPosted: 0
  };

  componentDidMount() {
    this.fetchShoes();
  }

  componentDidUpdate(prevProps) {
    if (this.props.gender && prevProps.gender && this.props.gender !== prevProps.gender) {
      this.fetchShoes();
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.isPostingShoes && <Text>Uploading {this.state.shoes.length} shoes</Text>}
        {this.state.totalShoesPosted > 0 && (
          <Text>{this.state.totalShoesPosted} shoes uploaded</Text>
        )}
        <FlatList
          style={{ flex: 1 }}
          data={this.state.shoes}
          keyExtractor={(_itm, idx) => idx.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={{ flexWrap: "wrap", flex: 1 }}>
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 200, height: 100, resizeMode: "contain" }}
              />
              <Text numberOfLines={2}>{item.title}</Text>
            </View>
          )}
        />
        <View style={{ position: "absolute", right: 30, bottom: 30 }}>
          {this.state.isPostingShoes ? (
            <ActivityIndicator />
          ) : (
            <Icon
              name={this.state.totalShoesPosted === 0 ? "add" : "check"}
              reverse
              onPress={this.uploadShoes.bind(this)}
            />
          )}
        </View>
      </View>
    );
  }

  uploadShoes() {
    if (!this.state.isPostingShoes && this.state.totalShoesPosted === 0) {
      this.setState(
        {
          isPostingShoes: true
        },
        () => {
          axios
            .post("http://192.168.0.12:8080/api/v1/shoe/create", {
              shoes: this.state.shoes.map(t => ({
                ...t,
                gender: t.gender || "none"
              }))
            })
            .then(response => {
              const data = response.data;
              this.setState({ isPostingShoes: false, totalShoesPosted: data.total });
            })
            .catch(e => {
              this.setState(
                {
                  isPostingShoes: false
                },
                () => {
                  Alert.alert(`Error: ${JSON.stringify(e, null, 2)}`);
                }
              );
            });
        }
      );
    }
  }

  fetchShoes() {
    const { brand, page, year, gender } = this.props;
    this.setState({ isFetchingShoes: true }, () => {
      fetch(
        `https://stockx.com/api/browse?page=${page}&productCategory=sneakers&brand=${brand}&year=${year}` +
          (gender ? `&gender=${gender}` : "")
      )
        .then(res => res.json())
        .then(data => {
          let shoesData = data.Products.map(raw => ({
            brand: raw.brand,
            category: raw.category,
            colorway: raw.colorway ? raw.colorway.split("/") : [],
            description: raw.description,
            gender: raw.gender,
            imageUrl: raw.media && raw.media.imageUrl ? raw.media.imageUrl : "",
            name: raw.name,
            releaseDate: raw.releaseDate,
            retailPrice: raw.retailPrice,
            shoe: raw.shoe,
            title: raw.title,
            styleId: raw.styleId,
            tags: raw._tags ? raw._tags.filter(t => t.indexOf("|") === 0) : []
          }));
          this.setState(s => {
            return {
              shoes: shoesData.filter(s => typeof s.title !== undefined)
            };
          });
        })
        .catch(e => Alert.alert(`Error ${JSON.stringify(e)}`));
    });
  }
}
