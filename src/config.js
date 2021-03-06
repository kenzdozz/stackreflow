const jwtSecret = 'stackreflowing';
const prodDb = {
  connectionString: 'postgres://diabpyfbimjuya:c50f60c6ad2f56d26aa449bc5814a3323d4a6e32e544ce26619a4f9868618e18@ec2-54-227-244-12.compute-1.amazonaws.com:5432/d233ill936cr99',
  ssl: true,
};
const devDb = {
  user: 'postgres',
  host: 'localhost',
  database: 'stackreflow',
  password: '',
  port: 5432,
};
const dbConnObj = process.env.NODE_ENV ? prodDb : devDb;

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
    answers: 'There are no answers for this question',
    answer: 'This answer cannot be found',
  },
};

function timeAgo(aTime) {
  let time = null;
  switch (typeof aTime) {
    case 'number':
      break;
    case 'string':
      time = +new Date(aTime);
      break;
    case 'object':
      if (aTime.constructor === Date) time = aTime.getTime();
      break;
    default:
      time = +new Date();
  }
  const timeFormats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  let seconds = (+new Date() - time) / 1000;


  let token = 'ago';


  let listChoice = 1;

  if (seconds === 0) {
    return 'Just now';
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    listChoice = 2;
  }
  let i = 0;


  let format;
  while (timeFormats[i]) {
    i += 1;
    format = timeFormats[i];
    if (seconds < format[0]) {
      if (typeof format[2] === 'string') return format[listChoice];
      return `${Math.floor(seconds / format[2])} ${format[1]} ${token}`;
    }
  }
  return time;
}

export {
  jwtSecret, dbConnObj, code, errMsg, timeAgo,
};
