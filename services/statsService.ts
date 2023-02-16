import API from './api'

const getUserLeaderboard = async (page: number) => {
  return await API.get(`leaderboard?page=${page}`)
}

export const statsService = {
  getUserLeaderboard,
}
