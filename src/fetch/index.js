import 'whatwg-fetch'

const mockApi = {}
const mockData = {}
const _options = {}


export function config(options){
	Object.assign(_options, options)
}

export function mock(url, handler){
	mockApi[url] = handler
}

export function get(url, headers){

	if(_options.mock){
		return new Promise((resolve, reject) =>{
			setTimeout(()=>{
				resolve(mockApi[url](headers))
			},0)
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

	return new Promise((resolve, reject)=>{
		fetch(url, headers)
			.then(response=>response.json())
			.then(responseJson=>resolve(responseJson))
			.catch(error=>reject(error))
	})
}

export function post(url, data, headers ){
	if(_options.mock){
		return new Promise((resolve, reject) =>{
			setTimeout(()=>{
				resolve(mockApi[url](data, headers))
			},0)
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

	return new Promise((resolve, reject)=>{
		fetch(url, headers)
			.then(response=>response.json())
			.then(responseJson=>resolve(responseJson))
			.catch(error=>reject(error))
	})
	
}

export function test(url, data, result){
	return new Promise((resolve, reject) =>{
		setTimeout(()=>{
			resolve(result)
		},0)
	})
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