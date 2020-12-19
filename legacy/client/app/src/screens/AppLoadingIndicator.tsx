import {Modal, View, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {themes} from 'resources';
import {AppText} from './Shared';
import {IAppState} from 'store/AppStore';
import {useSelector} from 'react-redux';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 100,
    height: 100,
    backgroundColor: themes.AppModalBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: themes.ButtonBorderRadius,
  },
});

export const AppLoadingIndicator: React.FC<{}> = () => {
  const isLoading = useSelector(
    (s: IAppState) => s.LoadingIndicatorState.isLoading,
  );

  const message = useSelector(
    (s: IAppState) => s.LoadingIndicatorState.message,
  );

  return (
    <Modal
      presentationStyle={'overFullScreen'}
      visible={isLoading}
      transparent={true}
      animationType={'fade'}
      animated={true}>
      <View style={styles.container}>
        <View style={styles.indicator}>
          <ActivityIndicator size={'large'} color={'white'} />
          {message && (
            <AppText.Subhead style={{color: themes.AppAccentColor}}>
              {message}
            </AppText.Subhead>
          )}
        </View>
      </View>
    </Modal>
  );
};
