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
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  fieldValue: {
    color: theme.palette.text.primary
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

  const isStacked = variant === 'stacked';
  const formattedValue = formatItemValue(value);

  return (
    <div style={{ display: 'flex', flexDirection: isStacked ? 'column' : 'row', gap: isStacked ? 0 : 16, padding: '4px 0' }}>
      {name && (
        <div style={{ flexShrink: 0, maxWidth: isStacked ? 'none' : 160, width: isStacked ? '100%' : 'auto' }}>
          <Typography variant='body2' component='span' className={classes.fieldLabel}>
            {name}
          </Typography>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: formattedValue }} />
        ) : (
          <Typography variant={isStacked ? 'h6' : 'body2'} component='span' className={classes.fieldValue}>
            {formattedValue}
          </Typography>
        )}
      </div>
    </div>
  );
}
