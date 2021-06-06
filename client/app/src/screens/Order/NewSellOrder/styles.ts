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
});
