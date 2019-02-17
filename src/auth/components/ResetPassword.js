import React from 'react';
import { Button } from '@material-ui/core';

const ResetPassword = () => (
  <div style={{
    textAlign: 'right',
    paddingBottom: '16px',
  }}
  >
    <Button
      variant="text"
      color="primary"
      disableRipple
      className="simple-button"
      onClick={() => {}}
    >
      Reset password?
    </Button>
  </div>
);

export default ResetPassword;
