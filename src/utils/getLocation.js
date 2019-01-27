const getLocation = async (callback) => {
  if (window.navigator.geolocation) {
    const location = window.navigator.geolocation;
    if (location) {
      await location.getCurrentPosition((position) => {
        callback(position);
      });
    }
  } else {
    alert('Your browser does not support Geolocation!');
  }
};

export default getLocation;
