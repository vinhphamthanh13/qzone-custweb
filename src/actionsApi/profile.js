import axios from 'axios';

// ********** user-controller *********** //
// aws-users
export const updateProfile = data => axios.put('/aws-users', data);
export const findUserById = data => axios.get(`/users/${data}`);
