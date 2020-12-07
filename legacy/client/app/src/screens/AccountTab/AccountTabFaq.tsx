import React from 'react';
import {getDependency} from 'utilities';
import {ISettingsProvider, FactoryKeys, SettingsKey} from 'business';
import {SafeAreaView, View, SectionList, StyleSheet} from 'react-native';
import {AppText} from 'screens/Shared';
import {themes} from 'resources';

type FAQ = Array<{
  category: string;
  info: Array<{
    question: string;
    answer: string;
  }>;
}>;

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: 'white',
    borderBottomColor: themes.AppDisabledColor,
    borderBottomWidth: 0.5,
  },
  sectionTitle: {
    marginVertical: 8,
    marginLeft: 10,
    color: themes.AppPrimaryColor,
  },
});

export const AccountTabFaq = (): JSX.Element => {
  const settings = getDependency<ISettingsProvider>(
    FactoryKeys.ISettingsProvider,
  );
  const faq: FAQ = settings.getValue(SettingsKey.RemoteSettings).faq;
  const sectionalFaq = faq.map((t) => ({
    title: t.category,
    data: t.info,
  }));

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <SectionList
          sections={sectionalFaq}
          keyExtractor={(item, index): string => index.toString()}
          renderSectionHeader={({section}): JSX.Element => (
            <View style={styles.sectionContainer}>
              <AppText.Title1 style={styles.sectionTitle}>
                {section.title}
              </AppText.Title1>
            </View>
          )}
          renderItem={({item}): JSX.Element => (
            <View style={{backgroundColor: 'white', padding: 20}}>
              <AppText.Title2>{item.question}</AppText.Title2>
              <AppText.Body style={{marginTop: 10}}>{item.answer}</AppText.Body>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
