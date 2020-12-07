import {themes} from 'resources';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
    // marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginTop: 24,
  },
  orderTypeOutterContainer: {
    height: themes.MediumButtonHeigt,
    marginHorizontal: 40,
    marginTop: 20,
    // marginVertical: 10,
  },
});
