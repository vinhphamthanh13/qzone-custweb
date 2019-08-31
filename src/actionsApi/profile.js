import axios from 'axios';

// ********** user-controller *********** //
// aws-users
export const updateProfile = (data, headers) => axios.put('/aws-users', data, headers);

// event-resource
export const eventsCancelById = (data, headers) => axios.delete(`/events/cancel/${data}`, headers);
