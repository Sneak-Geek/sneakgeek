import {Modal, View, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {themes} from 'resources';
import {AppText} from './Shared';
import {connect} from 'utilities/ReduxUtilities';
import {IAppState} from 'store/AppStore';

type Props = {
  isLoading: boolean;
  message?: string;
};

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

@connect(
  (state: IAppState) => ({
    isLoading: state.LoadingIndicatorState.isLoading,
    message: state.LoadingIndicatorState.message,
  }),
  null,
)
export class AppLoadingIndicator extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <Modal
        presentationStyle={'overFullScreen'}
        visible={this.props.isLoading}
        transparent={true}
        animationType={'fade'}
        animated={true}>
        <View style={styles.container}>
          <View style={styles.indicator}>
            <ActivityIndicator size={'large'} color={'white'} />
            {this.props.message && (
              <AppText.Subhead style={{color: themes.AppAccentColor}}>
                {this.props.message}
              </AppText.Subhead>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}
