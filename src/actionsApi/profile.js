import axios from 'axios';

// ********** user-controller *********** //
// aws-users
export const updateProfile = (data, headers) => axios.put('/aws-users', data, headers);

