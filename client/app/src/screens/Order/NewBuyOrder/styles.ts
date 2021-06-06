import {themes} from 'resources';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  shoeDetailContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flex: 1,
    paddingHorizontal: 8,
    maxHeight: 100,
  },
  shoeDetailTextContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingRight: 5,
  },


  sectionContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    marginBottom: 8,
  },
  orderTypeSelected: {
    flex: 1.5,
    borderRadius: themes.LargeBorderRadius,
    backgroundColor: 'black',
  },

  commonOrderType: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderTypeContainer: {
    flexDirection: 'row',
    flex: 2,
    borderRadius: 40,
    backgroundColor: themes.AppDisabledColor,
  },
  inputContainer: {
    borderColor: themes.DisabledColor,
    borderWidth: 1,
    borderRadius: themes.ButtonBorderRadius,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 5,
    minHeight: themes.RegularButtonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  orderTypeOutterContainer: {
    height: themes.MediumButtonHeigt,
    marginHorizontal: 40,
    marginVertical: 10,
    marginTop: 20,
  },
});
