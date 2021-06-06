import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  TextField,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { CatalogType, Catalog } from 'business';

const useStyles = makeStyles((theme: Theme) => ({
  coverImg: {
    maxWidth: 300,
    height: 'auto',
    margin: '0 auto',
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  cardTitle: {
    marginBottom: theme.spacing(5),
  },
}));

const CatalogEditContent = (props: {
  catalog: Partial<Catalog>;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
  onCatalogTypeChange: (catalogType: CatalogType) => void;
}): JSX.Element => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography variant={'h4'} className={classes.cardTitle}>
          Thông tin catalog
        </Typography>
        {props.catalog.coverImage && (
          <CardMedia
            component={'img'}
            alt={'Catalog cover image'}
            image={props.catalog.coverImage}
            className={classes.coverImg}
          />
        )}
        <TextField
          className={classes.textField}
          fullWidth
          variant={'outlined'}
          label={'Title'}
          onChange={(event) => props.onTitleChange(event.target.value)}
          defaultValue={props.catalog.title}
        />
        <TextField
          className={classes.textField}
          fullWidth
          variant={'outlined'}
          label={'Miêu tả'}
          defaultValue={props.catalog.description}
          onChange={(event) => props.onDescriptionChange(event.target.value)}
        />
        <Autocomplete
          options={Object.keys(CatalogType)}
          getOptionLabel={(option) => option}
          defaultValue={props.catalog.catalogType}
          renderInput={(params: any) => (
            <TextField {...params} label={'Loại catalog'} variant="outlined" />
          )}
          onInputChange={(_, value, reason) => {
            if (reason && value && value.length > 0) {
              props.onCatalogTypeChange(value as CatalogType);
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
export default CatalogEditContent;
