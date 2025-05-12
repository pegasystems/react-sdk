import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

// FieldValueList is one of the few components that does NOT have getPConnect.
//  So, no need to extend PConnProps
interface FieldValueListProps {
  // If any, enter additional props that only exist on this component
  name?: string;
  value: any;
  variant?: string;
  isHtml?: boolean;
}

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  fieldLabel: {
    fontWeight: 500,
    fontSize: '1.8rem',
    color: theme.palette.text.secondary
  },
  fieldValue: {
    color: theme.palette.text.primary,
    fontSize: '1.5em'
  },
  noPaddingTop: {
    paddingTop: '0 !important'
  },
  noPaddingBottom: {
    paddingBottom: '0 !important'
  }
}));

function formatItemValue(value) {
  let formattedVal = value;

  // if the value is undefined or an empty string, we want to display it as "---"
  if (formattedVal === undefined || formattedVal === '') {
    formattedVal = '---';
  }

  return formattedVal;
}

export default function FieldValueList(props: FieldValueListProps) {
  const { name, value, variant = 'inline', isHtml = false } = props;
  const classes = useStyles();

  function getGridItemLabel() {
    return (
      <Grid item xs={variant === 'stacked' ? 12 : 10} className={variant === 'stacked' ? classes.noPaddingBottom : ''}>
        <Typography variant='body2' component='span' className={`${classes.fieldLabel}`}>
          {name}
        </Typography>
      </Grid>
    );
  }

  function getGridItemValue() {
    const formattedValue = formatItemValue(value);

    return (
      <Grid item xs={variant === 'stacked' ? 12 : 10} className={variant === 'stacked' ? classes.noPaddingTop : ''}>
        {isHtml ? (
          // eslint-disable-next-line react/no-danger
          <div dangerouslySetInnerHTML={{ __html: formattedValue }} />
        ) : (
          <Typography variant={variant === 'stacked' ? 'h6' : 'body2'} component='span' className={classes.fieldValue}>
            {formattedValue}
          </Typography>
        )}
      </Grid>
    );
  }

  return (
    <Grid container spacing={4} justifyContent='space-between' style={{ flexDirection: 'column' }}>
      {getGridItemLabel()}
      {getGridItemValue()}
    </Grid>
  );
}
