import React, {ErrorInfo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'resources';
import {AppText} from 'screens/Shared';

const styles = StyleSheet.create({
  flexAll: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexWrap: {
    flexShrink: 1,
  },
});

type State = {
  error: Error;
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<{}, State> {
  state = {
    error: null,
    hasError: false,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error);
    console.log(errorInfo);
  }

  static getDerivedStateFromError(error: Error) {
    return {error, hasError: true};
  }

  render() {
    if (!this.state.error || !this.state.hasError) {
      return this.props.children;
    }

    return (
      <SafeAreaView style={styles.flexAll}>
        <View style={[styles.container, styles.flexAll]}>
          <AppText.Body style={styles.flexWrap}>
            {strings.ErrorPleaseTryAgain} {'\n'} {this.state.error.stack}
          </AppText.Body>
        </View>
      </SafeAreaView>
    );
  }
}
