import palette from '../pallete';

export default {
  root: {
    '&$selected': {
      backgroundColor: palette.background.default,
    },
    '&$hover': {
      '&:hover': {
        backgroundColor: palette.background.default,
      },
    },
  },
};
