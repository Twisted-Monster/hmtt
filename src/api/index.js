import axios from '@/utils/request.js'
export const getAllChannelsAPI = () =>
  axios({
    url: '/v1_0/channels'
  })
