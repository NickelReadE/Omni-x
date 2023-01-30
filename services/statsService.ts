import API from './api'

const getUserLeaderboard = async () => {
  const res = await API.get('leaderboard')
  return res
}

export const statsService = {
  getUserLeaderboard,
}
