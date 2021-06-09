import React from 'react';
import {themes, images} from 'resources';
import {Avatar, Rating} from 'react-native-elements';
import {Review, Profile} from 'business';
import {StyleSheet, View} from 'react-native';
import {AppText} from './Text';
import {toVnDateFormat} from 'utilities';

const styles = StyleSheet.create({
  reviewContent: {flexDirection: 'row', marginBottom: 8},
  reviewAvatar: {borderWidth: 0.5, borderColor: themes.DisabledColor},
  reviewAuthor: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 20,
    justifyContent: 'space-between',
  },
});

export const ReviewItem = (props: {review: Review}): JSX.Element => {
  const {review} = props;
  const profile = review.reviewedBy.profile as Partial<Profile>;
  const {userProvidedName, userProvidedProfilePic} = profile;
  const avatar = userProvidedProfilePic
    ? {uri: userProvidedProfilePic}
    : images.Profile;

  return (
    <View style={{marginVertical: 8}}>
      <View style={styles.reviewContent}>
        <Avatar
          rounded
          source={avatar}
          size={'small'}
          containerStyle={styles.reviewAvatar}
        />
        <View style={styles.reviewAuthor}>
          <AppText.Body>
            {userProvidedName.firstName} {userProvidedName.lastName}
          </AppText.Body>
          <AppText.Footnote>
            {toVnDateFormat(review.updatedAt)}
          </AppText.Footnote>
        </View>
        <Rating
          ratingColor="#1ABC9C"
          startingValue={review.rating}
          readonly
          imageSize={themes.IconSize / 1.5}
        />
      </View>
      <AppText.Subhead>{review.description}</AppText.Subhead>
    </View>
  );
};
