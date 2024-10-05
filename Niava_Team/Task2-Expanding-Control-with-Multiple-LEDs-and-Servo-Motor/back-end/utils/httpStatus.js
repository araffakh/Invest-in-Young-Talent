const SUCCESS = "success";
const ERROR = "error";

function goodResponse(data) {
  let httpResponse = { status: SUCCESS, code: 200, data: data };
  return httpResponse;
}

function badResponse(code, massage) {
  let httpResponse = {
    status: ERROR,
    code: code,
    massage: massage,
    data: null,
  };
  return httpResponse;
}

module.exports = {
  SUCCESS,
  ERROR,
  goodResponse,
  badResponse,
};
