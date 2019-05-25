import axios from 'axios';

// ********** user-controller *********** //
// aws-users
export const updateProfile = data => axios.put('/aws-users', data);

// event-resource
export const eventsCancelById = data => axios.delete(`/events/cancel/${data}`);
