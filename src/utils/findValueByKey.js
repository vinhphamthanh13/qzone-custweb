export default function findValueByKey(object, key, result) {
  if (object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result.push(object[key]);
    }
    for (let i = 0; i < Object.keys(object).length; i += 1) {
      if (typeof object[Object.keys(object)[i]] === 'object') {
        findValueByKey(object[Object.keys(object)[i]], key, result);
      }
    }
  }
}
