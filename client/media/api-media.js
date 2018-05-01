import config from '../../config/config'
const create = (params, credentials, media) => {
  return fetch('/api/media/new/'+ params.userId, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: media
  }).then((response) => {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

const listPopular = (params) => {
  return fetch('/api/media/popular', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}

const listByUser = (params) => {
  return fetch('/api/media/by/'+ params.userId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}

const read = (params) => {
  return fetch(config.serverUrl +'/api/media/' + params.mediaId, {
    method: 'GET'
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}

const update = (params, credentials, media) => {
  return fetch('/api/media/' + params.mediaId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify(media)
  }).then((response) => {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

const remove = (params, credentials) => {
  return fetch('/api/media/' + params.mediaId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

const listRelated = (params) => {
  return fetch('/api/media/related/'+ params.mediaId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}

export {
  create,
  listPopular,
  listByUser,
  read,
  update,
  remove,
  listRelated
}
