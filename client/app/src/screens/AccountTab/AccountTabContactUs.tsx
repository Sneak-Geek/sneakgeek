import React from 'react';
import {ListItem} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings, themes} from 'resources';

export const ContactUs: React.FC<{}> = () => {
  return (
    <SafeAreaView style={{flex: 1, paddingTop: 0}}>
      <ListItem>
        <ListItem.Content>
          <ListItem.Title style={themes.TextStyle.body}>
            {strings.CustomerSupportPOCName}
          </ListItem.Title>
          <ListItem.Subtitle
            style={[themes.TextStyle.footnoteRegular, {marginTop: 8}]}>
            Email: {strings.CustomerSupportEmail}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </SafeAreaView>
  );
};
