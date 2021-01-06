import React from 'react';
import { ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { strings, themes } from 'resources';

export const ContactUs: React.FC<{}> = () => {
  return (
    <SafeAreaView style={{flex: 1, paddingTop: 0}}>
      <ListItem title={strings.CustomerSupportPOCName} subtitle={strings.CustomerSupportEmail} titleStyle={themes.TextStyle.body} subtitleStyle={themes.TextStyle.callout}/>
    </SafeAreaView>
  )
}