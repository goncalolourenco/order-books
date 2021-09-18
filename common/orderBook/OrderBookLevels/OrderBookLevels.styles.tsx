import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<
  Theme,
  { progressBarDirection: 'rtl' | 'ltr' }
>({
  root: {
    maxWidth: '800px',
    minWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
  },
  orderHeader: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    paddingTop: '10px',
    paddingBottom: '10px',
    marginBottom: '-5px',
    backgroundColor: '#0a1929',

    '&>span:first-child': {
      cursor: 'pointer',
    },
  },
  orderItemRow: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  orderItemValue: {
    flexBasis: '33.3%',
    flexGrow: 1,
    textAlign: 'end',
    zIndex: 1,
    marginLeft: '15px',
    marginRight: '15px',
  },
  progressBar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sortAsc: ({ progressBarDirection }) => ({
    paddingRight: '10px',
    direction: 'ltr',
    textAlign: progressBarDirection === 'ltr' ? 'end' : 'start',

    '&:after': {
      content: '""',
      position: 'relative',
      left: '2px',
      border: '8px solid transparent',
      bottom: '15px',
      borderBottomColor: 'silver',
    },
  }),
  sortDesc: ({ progressBarDirection }) => ({
    paddingRight: '10px',
    direction: 'ltr',
    textAlign: progressBarDirection === 'ltr' ? 'end' : 'start',

    '&:after': {
      content: '""',
      position: 'relative',
      left: '2px',
      border: '8px solid transparent',
      top: '15px',
      borderTopColor: 'silver',
    },
  }),
});
