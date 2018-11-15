import axios from 'axios';

export const getServices = () => axios.get('/services');

export const getServiceCategories = () => axios.get('/service-categorys');
