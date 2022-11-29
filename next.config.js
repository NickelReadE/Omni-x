module.exports = {
  env: {
    API_BASE_URL: process.env.NEXT_DEVELOPMENT ? 'http://localhost:5000/api/v1/' : process.env.NEXT_API_BASE_URL,
    API_URL: 'https://bucket-26n19n.s3.amazonaws.com/',
    MORALIS_API_KEY: process.env.NEXT_MORALIS_API_KEY,
    INFURA_API_KEY: process.env.NEXT_INFURA_API_KEY,
    GOERLI_ALCHEMY_API_KEY: process.env.NEXT_GOERLI_ALCHEMY_API_KEY,
    ARBITRUM_ALCHEMY_API_KEY: process.env.NEXT_ARBITRUM_ALCHEMY_API_KEY,
    OPTIMISM_ALCHEMY_API_KEY: process.env.NEXT_OPTIMISM_ALCHEMY_API_KEY,
    MUMBAI_ALCHEMY_API_KEY: process.env.NEXT_MUMBAI_ALCHEMY_API_KEY,
  },
  images: {
    domains: ['localhost', 'bucket-26n19n.s3.amazonaws.com']
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: !process.env.NEXT_DEVELOPMENT,
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
