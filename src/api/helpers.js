export const handleResponse = (response) => {
  if (response && response.status === 200) {
    return response.data.objects || response.data.object;
  }
  return null;
};
