import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TextStyle,
} from 'react-native';
import {AppText} from './Text';
import {Icon} from 'react-native-elements';
import {themes} from 'resources';
import Collapsible from 'react-native-collapsible';

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  content: {
    marginTop: 10,
  },
});

type Props = {
  title: string;
  content: string | number | JSX.Element;
  emphasizeTitle?: boolean;
  renderCollapsibleIndicator?: boolean;
  onCollapsibleExpand?: () => void;
  renderCollapsibleContent?: () => JSX.Element;
  subtitleStyle?: TextStyle;
};

export const TitleContentDescription = (props: Props): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);
  const isComponent =
    typeof props.content !== 'number' && typeof props.content !== 'string';

  return (
    <TouchableWithoutFeedback
      onPress={(): void => {
        props.onCollapsibleExpand?.();
        setCollapsed(!collapsed);
      }}>
      <View>
        <View style={styles.rootContainer}>
          <View style={styles.sectionContainer}>
            <AppText.Subhead>
              {props.emphasizeTitle ? props.title.toUpperCase() : props.title}
            </AppText.Subhead>
            {!isComponent && (
              <AppText.Body style={[styles.content, props.subtitleStyle]}>
                {props.content}
              </AppText.Body>
            )}
            {isComponent && props.content}
          </View>
          {props.renderCollapsibleIndicator && (
            <Icon
              name={collapsed ? 'expand-less' : 'expand-more'}
              size={themes.IconSize}
            />
          )}
        </View>
        {props.renderCollapsibleIndicator && (
          <Collapsible collapsed={collapsed}>
            {props.renderCollapsibleContent?.()}
          </Collapsible>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
