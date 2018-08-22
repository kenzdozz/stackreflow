const jwtSecret = 'stackreflowing';
const code = {
  unAuthorized: 401,
  notFound: 404,
  serverError: 500,
  ok: 200,
  created: 201,
  accepted: 202,
  badRequest: 400,
  forbidden: 403,
  notAllowed: 405,
  conflict: 409,
};

const errMsg = {
    serverError: 'Internal server error',
    unAuthorized: 'You are not authorized',
    notFound: {
        users: 'There are no users found',
        user: 'This user cannot be found',
        questions: 'There are no questions found',
        question: 'This question cannot be found',
    },
}

export { jwtSecret, code, errMsg };
