import API from './api'

const getUserLeaderboard = async () => {
  return await API.get('leaderboard')
}

export const statsService = {
  getUserLeaderboard,
}
