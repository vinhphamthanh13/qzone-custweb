import axios from 'axios';
import { SURVEY_URL } from 'config/api';

// survey controller
export const surveys = () => axios.get(SURVEY_URL);
