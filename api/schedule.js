const BASE_URL = 'https://your-api-domain.com'

const request = (options) => {
	  return new Promise((resolve, reject) => {
		      wx.request({
			            url: BASE_URL + options.url,
			            method: options.method || 'GET',
			            data: options.data || {},
			            header: {
					            'Content-Type': 'application/json',
					            'Authorization': wx.getStorageSync('token')
					          },
			            success: (res) => {
					            if (res.statusCode === 200) {
							              resolve(res.data)
							            } else {
									              reject(res.data)
									            }
					          },
			            fail: (err) => {
					            reject(err)
					          }
			          })
		    })
}

export const getSchedule = (week) => {
  return request({
    url: '/schedule',
    method: 'GET',
    data: { week }
  });
};
