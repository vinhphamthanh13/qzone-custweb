import axios from 'axios';

export const updateProfile = data => axios.post(`/aws-users/${data}`);
