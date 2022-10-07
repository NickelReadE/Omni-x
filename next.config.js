module.exports = {
  env: {
    API_BASE_URL: 'http://localhost:5000/api/v1/',
    API_URL: 'https://omni-x.s3.amazonaws.com/',
  },
  images: {
    domains: ['localhost', 'omni-x.s3.amazonaws.com'],
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
