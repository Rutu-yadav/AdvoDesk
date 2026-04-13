import api from "./api";

const requestService = {
  sendRequest: (clientId, advocateId) =>
    api.post(`/requests?clientId=${clientId}&advocateId=${advocateId}`)
};

export default requestService;