export const transition = {
  transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
};
export const container = {
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
  '@media (min-width: 768px)': {
    width: '750px',
  },
  '@media (min-width: 992px)': {
    width: '970px',
  },
  '@media (min-width: 1200px)': {
    width: '1170px',
  },
  '&:before,&:after': {
    display: 'table',
    content: '" "',
  },
  '&:after': {
    clear: 'both',
  },
};
export const card = {
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  margin: '25px 0',
  boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
  borderRadius: '6px',
  color: 'rgba(0, 0, 0, 0.87)',
  background: '#fff',
};
export const defaultFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: '300',
  lineHeight: '1.5em',
};
export const primaryColor = '#9c27b0';
export const warningColor = '#ff9800';
export const dangerColor = '#f44336';
export const successColor = '#4caf50';
export const infoColor = '#00acc1';
export const roseColor = '#e91e63';
export const grayColor = '#999999';
export const makoColor = '#3c4149';
export const lightGrayColor = '#cccccc';
export const mainColor = '#3f51b5';
export const malibuColor = '#57c9f9';
export const mainLinear = {
  background: `linear-gradient(${mainColor}, ${malibuColor})`,
};
export const primaryBoxShadow = {
  boxShadow:
    '0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), '
    + '0 7px 8px -5px rgba(156, 39, 176, 0.2)',
};
export const infoBoxShadow = {
  boxShadow:
    '0 12px 20px -10px rgba(0, 188, 212, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), '
    + '0 7px 8px -5px rgba(0, 188, 212, 0.2)',
};
export const successBoxShadow = {
  boxShadow:
    '0 12px 20px -10px rgba(76, 175, 80, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), '
    + '0 7px 8px -5px rgba(76, 175, 80, 0.2)',
};
export const warningBoxShadow = {
  boxShadow:
    '0 12px 20px -10px rgba(255, 152, 0, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), '
    + '0 7px 8px -5px rgba(255, 152, 0, 0.2)',
};
export const dangerBoxShadow = {
  boxShadow:
    '0 12px 20px -10px rgba(244, 67, 54, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), '
    + '0 7px 8px -5px rgba(244, 67, 54, 0.2)',
};
export const roseBoxShadow = {
  boxShadow:
    '0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(233, 30, 99, 0.4)',
};
export const mainBoxShadow = {
  boxShadow:
    '0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(00, 0, 0, 0.4)',
};
export const warningCardHeader = {
  background: 'linear-gradient(60deg, #ffa726, #fb8c00)',
  ...warningBoxShadow,
};
export const successCardHeader = {
  background: 'linear-gradient(60deg, #66bb6a, #43a047)',
  ...successBoxShadow,
};
export const dangerCardHeader = {
  background: 'linear-gradient(60deg, #ef5350, #e53935)',
  ...dangerBoxShadow,
};
export const infoCardHeader = {
  background: 'linear-gradient(60deg, #26c6da, #00acc1)',
  ...infoBoxShadow,
};
export const primaryCardHeader = {
  background: 'linear-gradient(60deg, #ab47bc, #8e24aa)',
  ...primaryBoxShadow,
};
export const mainCardHeader = {
  ...mainLinear,
  ...mainBoxShadow,
};
export const roseCardHeader = {
  background: 'linear-gradient(60deg, #ec407a, #d81b60)',
  ...roseBoxShadow,
};
export const title = {
  color: '#3C4858',
  textDecoration: 'none',
  fontWeight: '300',
  marginTop: '30px',
  marginBottom: '25px',
  minHeight: '32px',
  fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
  '& small': {
    color: '#777',
    fontSize: '65%',
    fontWeight: '400',
    lineHeight: '1',
  },
};
