import 'whatwg-fetch'

const mockApi = {}
const mockData = {}
const _options = {}

export function config(options) {
	Object.assign(_options, options)
}

export function mock(url, handler) {
	mockApi[url] = handler
}

export function get(url, headers) {
	before()
	if (_options.mock) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				var resp = mockApi[url](headers)
				resp = after(resp, url, undefined, headers)
				resolve(resp)
			}, 0)
		})
	}

	headers = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		...headers
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

export function post(url, data, headers) {
	before(url, data, headers)
	if (_options.mock) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				var resp = mockApi[url](data, headers)
				resp = after(resp, url, data, headers)
				resolve(resp)
			}, 0)
		})
	}

	headers = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		...headers,
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


export default {
	config,
	fetch,
	get,
	post,
	test,
	mockData,
	mock
}