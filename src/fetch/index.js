import 'whatwg-fetch'

const mockApi = {}
const mockData = {}
const _options = {}

export function config(options) {
	Object.assign(_options, options)
	if (options.token) {
		setAccessToken(options.token)
	}
}

export function mock(url, handler) {
	mockApi[url] = handler
}

export function get(url, headers, option) {
	if (option && option.ignoreAOP !== true) {
		before()
	}

	if (_options.mock) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (getAccessToken()) {
					headers = headers ? { ...headers, token: getAccessToken() } : { token: getAccessToken() }
				}
				var resp = mockApi[url](headers)
				if (option && option.ignoreAOP !== true) {
					resp = after(resp, url, undefined, headers)
				}
				resolve(resp)
			}, 0)
		})
	}

	headers = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...headers,
			token: getAccessToken()
		},

	}

	return new Promise((resolve, reject) => {
		fetch(url, headers)
			.then(response => response.json())
			.then(responseJson => {
				responseJson = after(responseJson, url, undefined, headers)
				resolve(responseJson)
			})
			.catch(error => reject(error))
	})
}

export function post(url, data, headers, option) {
	if (option && option.ignoreAOP !== true) {
		before(url, data, headers)
	}
	if (_options.mock) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (getAccessToken()) {
					headers = headers ? { ...headers, token: getAccessToken() } : { token: getAccessToken() }
				}
				var resp = mockApi[url](data, headers)
				if (option && option.ignoreAOP !== true) {
					resp = after(resp, url, data, headers)
				}
				resolve(resp)
			}, 0)
		})
	}

	headers = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...headers,
			token: getAccessToken()
		},
		body: JSON.stringify(data)
	}

	return new Promise((resolve, reject) => {
		fetch(url, headers)
			.then(response => response.json())
			.then(responseJson => {
				responseJson = after(responseJson, url, data, headers)
				resolve(responseJson)
			})
			.catch(error => reject(error))
	})

}

export function test(url, data, result) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(result)
		}, 0)
	})
}

function before(url, data, headers) {
	if (_options.before) {
		_options.before(url, data, headers)
	}
}

function after(response, url, data, headers) {
	if (_options.after) {
		return _options.after(response, url, data, headers)
	}

	return response
}

function getAccessToken() {
	return sessionStorage['_accessToken'] || '';
}

function setAccessToken(token) {
	sessionStorage['_accessToken'] = token;
}

function clearAccessToken() {
	sessionStorage['_accessToken'] = ''
}

export default {
	config,
	fetch,
	get,
	post,
	test,
	mockData,
	mock,
	mockApi,
	getAccessToken,
	setAccessToken,
	clearAccessToken
}