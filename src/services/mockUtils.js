export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const ok = async (data, ms = 250) => {
  await delay(ms);
  return data;
};

export const notFound = async (message = 'Not found', ms = 200) => {
  await delay(ms);
  const error = new Error(message);
  error.status = 404;
  throw error;
};

export const badRequest = async (message = 'Bad request', ms = 200) => {
  await delay(ms);
  const error = new Error(message);
  error.status = 400;
  throw error;
};


