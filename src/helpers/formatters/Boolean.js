function Boolean(value, { allowEmpty = true, tick = "", cross = "" } = {}) {
  if (
    (!allowEmpty && !value) ||
    value === false ||
    value?.toString()?.toLowerCase() === "false" ||
    value === 0 ||
    value === "0"
  ) {
    return cross || "";
  }
  if (
    value === true ||
    value?.toString()?.toLowerCase() === "true" ||
    value === 1 ||
    value === "1"
  ) {
    return tick || "";
  }
  if (
    allowEmpty &&
    (value === "null" ||
      value === "" ||
      value === null ||
      typeof value === "undefined")
  ) {
    return "- -";
  }
  return value;
}

export default {
  TrueFalse: (value, options) =>
    Boolean(value, {
      ...options,
      tick: "True",
      cross: "False"
    })
};
