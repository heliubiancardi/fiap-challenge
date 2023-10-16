import axios from 'axios'
import mock from './mock.json'

const useMock = false

export const evaluate = async (params) => {
  if (useMock) {
    return {
      status: 200,
      data: mock
    }
  }
  return axios.post('https://sentiment-api-dsv.azurewebsites.net/Sentiment', null, { params })
    .then((response => response))
    .catch(() => {
      return { status: 'error', data: 'Ops... Aconteceu um erro.' }
    });
}
