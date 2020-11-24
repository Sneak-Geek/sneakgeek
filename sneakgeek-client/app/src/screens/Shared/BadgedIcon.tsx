import React from 'react';
import {withBadge, Icon, IconProps} from 'react-native-elements';

export const BadgedIcon = (props: IconProps & {count: number}) => {
  const BadgedIconElem: React.ComponentType<IconProps> = withBadge(
    props.count,
    {
      right: 5,
      top: -2,
    },
  )(Icon);

  return props.count === 0 ? (
    <Icon {...props} />
  ) : (
    <BadgedIconElem {...props} />
  );
};
