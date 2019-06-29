export const getItem = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    return undefined;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    //
  }
};

export const removeItem = key => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    //
  }
};
