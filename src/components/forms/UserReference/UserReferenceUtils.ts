export const getUserId = (user) => {
  let userId = '';
  if (typeof user === 'object' && user !== null && user.userId) {
    userId = user.userId;
  } else if (typeof user === 'string' && user) {
    userId = user;
  }
  return userId;
};

export const isUserNameAvailable = (user) => {
  return typeof user === 'object' && user !== null && user.userName;
};
