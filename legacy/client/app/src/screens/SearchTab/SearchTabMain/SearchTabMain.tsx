import React from 'react';
import {ColumnShoeCard, AppText, BottomButton} from 'screens/Shared';
import {
  Image,
  View,
  ActivityIndicator,
  Keyboard,
  EmitterSubscription,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {SafeAreaConsumer, SafeAreaView} from 'react-native-safe-area-context';
import {SearchBar, Icon, ListItem, Button} from 'react-native-elements';
import {themes, strings, images} from 'resources';
import {IShoeService, ObjectFactory, FactoryKeys, Shoe, Gender} from 'business';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import RouteNames from 'navigations/RouteNames';
import {RootStackParams} from 'navigations/RootStack';
import {getDependency} from 'utilities';
import {ISettingsProvider, SettingsKey} from 'business/src';
import {styles} from './styles';

const ListChoice = (props: {
  isMultiple: boolean;
  options: string[];
  chosen: string | string[];
  onSelect: (value: string) => void;
}): JSX.Element => {
  const isChosen = (value: string): boolean => {
    return props.isMultiple
      ? (props.chosen as string[]).some((t) => t === value)
      : props.chosen === value;
  };
  return (
    <View>
      {props.options.map((item, index) => (
        <ListItem
          key={index}
          title={item}
          titleStyle={[
            themes.TextStyle.body,
            {
              color: isChosen(item)
                ? themes.AppSecondaryColor
                : themes.AppAccentColor,
            },
          ]}
          onPress={(): void => props.onSelect(item)}
          bottomDivider={true}
          containerStyle={{
            backgroundColor: isChosen(item)
              ? themes.AppAccentColor
              : 'transparent',
          }}
          rightIcon={
            isChosen(item) ? (
              <Icon
                name={'check'}
                size={themes.IconSize}
                color={themes.AppPrimaryColor}
              />
            ) : null
          }
        />
      ))}
    </View>
  );
};

type Props = {
  navigation: StackNavigationProp<RootStackParams, 'SearchTabMain'>;
};

type State = {
  searchText: string;
  isSearching: boolean;
  shoes: Shoe[];
  showDropDown: boolean;
  currentSearchPage: number;
  shouldSearchScrollEnd: boolean;
  searchBarYLocation?: number;
  filterVisible: boolean;
  filter: {
    brand: string[];
    gender: string;
  };
};

export class SearchTabMain extends React.Component<Props, State> {
  private _shoeService: IShoeService = ObjectFactory.getObjectInstance(
    FactoryKeys.IShoeService,
  );
  private _keyboardHideListener: EmitterSubscription;
  private _hotKeyWords = ['Nike', 'adidas', 'Jordan', 'Off-White'];

  state: State = {
    searchText: '',
    isSearching: false,
    shoes: [],
    showDropDown: false,
    currentSearchPage: 0,
    shouldSearchScrollEnd: true,
    filterVisible: false,
    filter: {
      gender: '',
      brand: [],
    },
  };

  public componentDidMount(): void {
    this._keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.state.showDropDown && this.setState({showDropDown: false});
    });
  }

  public componentWillUnmount(): void {
    this._keyboardHideListener.remove();
  }

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <View style={[styles.rootContainer, {paddingTop: insets.top}]}>
            {this._renderSearchHeader()}
            {this._renderSearchDropDown(insets.top)}
            <View style={styles.pageContainer}>
              {this._renderSearchResults()}
            </View>
            {this._renderProductRequest()}
            {this._renderFilterModal()}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private _renderSearchHeader(): JSX.Element {
    return (
      <View>
        <View
          style={styles.searchBarRoot}
          onLayout={(event: LayoutChangeEvent): void =>
            this.setState({
              searchBarYLocation: event.nativeEvent.layout.height,
            })
          }>
          <SearchBar
            placeholder={strings.SearchTab}
            lightTheme={true}
            round={true}
            value={this.state.searchText}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInputContainer}
            searchIcon={{size: themes.IconSize, name: 'search'}}
            inputStyle={themes.TextStyle.body}
            onChangeText={(text: string): void => {
              const oldText = this.state.searchText;
              this.setState({showDropDown: true, searchText: text}, () => {
                if (text.length > oldText.length) {
                  this._search();
                }
              });
            }}
            onCancel={(): void =>
              this.setState({showDropDown: false, shouldSearchScrollEnd: true})
            }
            onClear={(): void =>
              this.setState({
                showDropDown: false,
                shoes: [],
                shouldSearchScrollEnd: true,
              })
            }
            onSubmitEditing={(): void => this.setState({showDropDown: false})}
          />
          <Icon
            name={'sort'}
            size={themes.IconSize}
            color={
              this._isFiltered()
                ? themes.AppPrimaryColor
                : themes.AppSecondaryColor
            }
            onPress={(): void => this.setState({filterVisible: true})}
          />
        </View>
        {this._renderHotKeywords()}
      </View>
    );
  }

  private _isFiltered(): boolean {
    const {gender, brand} = this.state.filter;
    return gender.length > 0 || brand.length > 0;
  }

  private _renderHotKeywords(): JSX.Element {
    return (
      <ScrollView horizontal={true}>
        <View style={{flexDirection: 'row', padding: 15}}>
          {this._hotKeyWords.map((k) => (
            <Button
              type={'outline'}
              title={k}
              key={k}
              containerStyle={{marginRight: 8}}
              buttonStyle={{
                borderColor: themes.AppSecondaryColor,
                borderWidth: 0.5,
              }}
              titleStyle={[
                themes.TextStyle.body,
                {color: themes.AppSecondaryColor},
              ]}
              onPress={(): void =>
                this.setState(
                  {
                    searchText: k,
                  },
                  () => {
                    this._search();
                  },
                )
              }
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  private _renderSearchDropDown(topInset: number): JSX.Element {
    if (!this.state.showDropDown || !this.state.searchBarYLocation) {
      return null;
    }

    const renderLeftAvatar = (s: Shoe): JSX.Element => (
      <Image
        source={
          s.media.thumbUrl ? {uri: s.media.thumbUrl} : images.ImagePlaceholder
        }
        style={styles.thumbnail}
        resizeMode={'contain'}
      />
    );

    return (
      <View
        style={[
          styles.dropDownContainer,
          {top: this.state.searchBarYLocation + topInset},
        ]}>
        {this.state.isSearching && (
          <View style={{marginVertical: 20}}>
            <ActivityIndicator />
          </View>
        )}
        {this.state.shoes.length > 0 && (
          <ScrollView keyboardShouldPersistTaps={'always'}>
            {this.state.shoes.map((s: Shoe) => (
              <ListItem
                key={s._id}
                leftAvatar={renderLeftAvatar(s)}
                title={s.title}
                titleStyle={themes.TextStyle.subhead}
                accessible={true}
                onPress={(): void => this._goToProduct(s)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

  private _renderSearchResults(): JSX.Element {
    if (this.state.showDropDown) {
      return null;
    }

    return (
      <View onTouchStart={(): void => Keyboard.dismiss()}>
        <FlatList
          data={this.state.shoes}
          keyExtractor={(item: Shoe, index: number): string =>
            `${index}${item._id}`
          }
          renderItem={({item}): JSX.Element => (
            <ColumnShoeCard
              shoe={item}
              onPress={(): void => this._goToProduct(item)}
            />
          )}
          columnWrapperStyle={{flex: 1, justifyContent: 'space-around'}}
          numColumns={2}
          onEndReached={(): Promise<void> => this._search(true)}
          style={{marginHorizontal: 5}}
        />
        {this.state.isSearching && <ActivityIndicator size={'small'} />}
      </View>
    );
  }

  private async _search(scrollEnd = false): Promise<void> {
    const {
      searchText,
      shoes,
      currentSearchPage,
      shouldSearchScrollEnd,
    } = this.state;
    const shouldSearch =
      this.state.searchText.length >= 3 || this._isFiltered();

    this.setState({
      shoes: scrollEnd ? shoes : [],
      isSearching: shouldSearch,
    });

    if (shouldSearch || (scrollEnd && shouldSearchScrollEnd)) {
      const result = await this._shoeService.searchShoes(
        searchText,
        currentSearchPage,
        this._getStandardizedGender(),
        this.state.filter.brand,
      );
      this.setState({
        isSearching: false,
      });

      if (result && result.shoes) {
        let newShoes = result.shoes;
        const shouldSearchScrollEnd = !(
          newShoes.length === 0 && currentSearchPage > 0
        );
        newShoes = newShoes.filter(
          (t) => !shoes.some((old) => old._id === t._id),
        );

        this.setState({
          shoes: [...this.state.shoes, ...newShoes],
          shouldSearchScrollEnd,
          currentSearchPage:
            scrollEnd && shouldSearchScrollEnd ? currentSearchPage + 1 : 0,
        });
      }
    }
  }

  private _goToProduct(shoe: Shoe): void {
    this.props.navigation.push(RouteNames.Product.Name, {
      screen: RouteNames.Product.ProductDetail,
      params: {shoe},
    });
  }

  private _renderProductRequest(): JSX.Element {
    return (
      <TouchableWithoutFeedback
        onPress={(): void =>
          this.props.navigation.push(RouteNames.Tab.SearchTab.ProductRequest)
        }>
        <View style={styles.productNotFound}>
          <AppText.Callout style={{color: themes.AppPrimaryColor}}>
            {strings.ProductNotFound}
          </AppText.Callout>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  private _renderFilterModal(): JSX.Element {
    return (
      <Modal
        visible={this.state.filterVisible}
        presentationStyle={'overFullScreen'}
        transparent={true}
        animated={true}
        animationType={'slide'}>
        <SafeAreaView
          style={{flex: 1, backgroundColor: themes.AppModalBackground}}>
          <View style={{flex: 1}}>
            <Icon
              name={'x'}
              type={'feather'}
              color={themes.AppAccentColor}
              onPress={(): void => this.setState({filterVisible: false})}
              containerStyle={styles.modalCloseIcon}
            />
            <ScrollView style={{flex: 1}}>
              <View style={{flex: 1}}>
                {this._renderGenderSelector()}
                {this._renderBrandSelector()}
              </View>
            </ScrollView>
            <BottomButton
              onPress={(): void =>
                this.setState(
                  {filterVisible: false, showDropDown: false},
                  (): any => this._search(),
                )
              }
              title={'Xem kết quả'}
              style={{backgroundColor: themes.AppPrimaryColor}}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  private _renderGenderSelector(): JSX.Element {
    return (
      <View>
        <AppText.Title2 style={styles.filterTitle}>
          {strings.Gender}
        </AppText.Title2>
        <ListChoice
          isMultiple={false}
          chosen={this.state.filter.gender}
          onSelect={(value: string): void => {
            this.setState({
              filter: {
                ...this.state.filter,
                gender: this.state.filter.gender === value ? '' : value,
              },
            });
          }}
          options={[strings.Men, strings.Women]}
        />
      </View>
    );
  }

  private _getStandardizedGender(): string {
    const {gender} = this.state.filter;
    if (gender.length > 0) {
      return gender === strings.Men ? Gender.men : Gender.women;
    }

    return '';
  }

  private _renderBrandSelector(): JSX.Element {
    const settings = getDependency<ISettingsProvider>(
      FactoryKeys.ISettingsProvider,
    );
    const brands = settings.getValue(SettingsKey.RemoteSettings).shoeBrands;

    return (
      <View style={{marginBottom: themes.RegularButtonHeight}}>
        <AppText.Title2 style={styles.filterTitle}>
          {strings.Brand}
        </AppText.Title2>
        <FlatList
          style={{marginBottom: 5}}
          horizontal={true}
          data={this.state.filter.brand}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index): string => index.toString()}
          renderItem={({item}): JSX.Element => (
            <TouchableWithoutFeedback
              onPress={(): void =>
                this.setState({
                  filter: {
                    ...this.state.filter,
                    brand: this.state.filter.brand.filter((t) => t !== item),
                  },
                })
              }>
              <View style={styles.chipContainer}>
                <AppText.Subhead>{item}</AppText.Subhead>
                <Icon name={'x'} type={'feather'} size={themes.IconSize} />
              </View>
            </TouchableWithoutFeedback>
          )}
        />
        <ListChoice
          isMultiple={true}
          options={brands}
          chosen={this.state.filter.brand}
          onSelect={(item: string): void => {
            let brand = this.state.filter.brand;
            if (this.state.filter.brand.some((t) => t === item)) {
              brand = brand.filter((t) => t !== item);
            } else {
              brand = [...brand, item];
            }

            this.setState({
              filter: {
                ...this.state.filter,
                brand,
              },
            });
          }}
        />
      </View>
    );
  }
}
