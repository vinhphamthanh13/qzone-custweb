const cardFooterStyle = {
  cardFooter: {
    padding: '0.75rem 1.25rem',
    borderRadius: '0',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'transparent',
    border: '0',
  },
  cardFooterProfile: {
    marginTop: '-15px',
  },
  cardFooterPlain: {
    paddingLeft: '5px',
    paddingRight: '5px',
    backgroundColor: 'transparent',
  },
  cardFooterPricing: {
    zIndex: '2',
  },
  cardFooterTestimonial: {
    display: 'block',
  },
  cardFooterStats: {
    borderTop: '1px solid #eee',
    marginTop: '20px',
    '& svg': {
      position: 'relative',
      top: '4px',
      marginRight: '3px',
      marginLeft: '3px',
      width: '16px',
      height: '16px',
    },
  },
  cardFooterChart: {
    borderTop: '1px solid #eee',
  },
};

export default cardFooterStyle;
