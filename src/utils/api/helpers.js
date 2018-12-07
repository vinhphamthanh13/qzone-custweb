export const handleResponse = (response) => {
  if (response && response.status === 200) {
    return response.data.objects;
  }
  return null;
};
