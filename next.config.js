module.exports = {
  env: {
    API_BASE_URL: process.env.NEXT_DEVELOPMENT ? 'http://localhost:5000/api/v1/' : 'https://api-dev.omni-x.io/api/v1/',
    API_URL: 'https://bucket-26n19n.s3.amazonaws.com/',
    MORALIS_SERVER_URL: process.env.NEXT_MORALIS_SERVER_URL,
    MORALIS_APP_ID: process.env.NEXT_MORALIS_APP_ID,
    MORALIS_SECRET: process.env.NEXT_MORALIS_SECRET
  },
  images: {
    domains: ['localhost', 'bucket-26n19n.s3.amazonaws.com']
  },
  rewrites: () => {
    return [
      {
        source: '/test/:path*',
        destination: '/collections/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
      {
        source: '/collections/:path*',
        destination: '/collections/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
    ]
  }
}
