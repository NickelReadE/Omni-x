import API from './api'

const getUserLeaderboard = async () => {
  const res = await API.get('leaderboard')
  return res.data
}

export const statsService = {
  getUserLeaderboard,
}
