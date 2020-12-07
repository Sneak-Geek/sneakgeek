import { createMuiTheme } from '@material-ui/core';

import palette from './pallete';
import typography from './typography';
import overrides from './overrides';

const theme = createMuiTheme({
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});

export default theme;
