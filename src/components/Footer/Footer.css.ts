import { style } from '@vanilla-extract/css';

export const footer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100px',
  width: '100%',
  backgroundColor: '#000',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'center',
  position: 'absolute',
  bottom: '0',
  '@media': {
    'screen and (min-width: 768px)': {
      height: '200px',
    },
  },
});
