import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { AppText } from 'screens/Shared';

type Props = {
  actionName: string;
  actionColor: string;
  children: React.ReactNode;
  onActionClicked: () => void;
};

const RightSwipeableRow: React.FC<Props> = (props: Props) => {
  const width = Dimensions.get('window').width;
  const actionWidth = Math.min(width / 3, 100);
  const renderRightAction = (progress: Animated.AnimatedInterpolation) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [actionWidth, 0],
    });

    return (
      <View style={{ width: actionWidth }}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton
            style={[styles.rightAction, { backgroundColor: props.actionColor }]}
            onPress={props.onActionClicked}>
            <Icon name={'delete'} color={'white'} />
            <AppText.Body style={styles.actionText}>
              {props.actionName}
            </AppText.Body>
          </RectButton>
        </Animated.View>
      </View>
    );
  }
  return (
    <Swipeable renderRightActions={renderRightAction}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}>
      {props.children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  actionText: {
    color: 'white',
    backgroundColor: 'transparent',
  },
})

export default RightSwipeableRow;