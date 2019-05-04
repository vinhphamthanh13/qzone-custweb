import axios from 'axios';

// ********** user-controller *********** //
// aws-users
export const updateProfile = data => axios.put('/aws-users', data);
