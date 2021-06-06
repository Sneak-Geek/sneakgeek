import React, {useEffect, useState} from 'react';
import {Image, Dimensions, StyleProp, ImageStyle} from 'react-native';
import {images} from 'resources';

export const ImageRatioPreserved = (props: {
  source: string;
  style?: StyleProp<ImageStyle>;
}): JSX.Element => {
  const [dimension, setDimension] = useState({width: -1, height: -1});
  useEffect(() => {
    Image.getSize(
      props.source,
      (width, height) => {
        setDimension({width, height});
      },
      () => {
        console.warn('Image source cannot be fetched');
      },
    );
  });

  const windowWidth = Dimensions.get('window').width;
  let aspectRatio = 1920 / 1080;

  if (dimension.width === -1 || dimension.height === -1) {
    return (
      <Image
        source={images.ImagePlaceholder}
        style={{width: windowWidth, height: windowWidth / aspectRatio}}
        resizeMode={'cover'}
      />
    );
  }

  aspectRatio = dimension.width / dimension.height;

  return (
    <Image
      source={{uri: props.source}}
      progressiveRenderingEnabled={true}
      loadingIndicatorSource={images.ImagePlaceholder}
      style={[
        {
          width: windowWidth,
          height: windowWidth / aspectRatio,
        },
        props.style,
      ]}
      resizeMode={'cover'}
    />
  );
};
