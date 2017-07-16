import 'whatwg-fetch'

export function get(url, headers){
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
	fetch,
	get,
	post,
	test
}