import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    levelsContainer: {
      display: 'flex',
      borderTop: '1px solid gray',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
      backgroundColor: '#0a1929',
      color: 'white',
      minHeight: '40px',

      '&>h3': {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: '5px',
      },
    },
    spread: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: '#0a1929',
      color: 'white',
      padding: '5px',
      minHeight: '40px',

      '&>h3': {
        position: 'absolute',
        left: 0,
        marginLeft: '5px',
      },
    },
  };
});
