import axios from 'axios'

export const evaluate = async (params) => {
  return axios.post('https://sentiment-api-dsv.azurewebsites.net/Sentiment', null, { params })
    .then((response => response))
    .catch((error) => error);
}