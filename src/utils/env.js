export const parseEnvVariable = value => {
  try {
    let variable = JSON.parse(value);
    if (!Array.isArray(variable)) {
      variable = [variable];
    }
    return variable;
  } catch (err) {
    return value;
  }
};
