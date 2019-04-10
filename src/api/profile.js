import axios from 'axios';

export const updateProfile = data => axios.put(`/aws-users/${data}`);
