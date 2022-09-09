import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
  return token
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id,updatedObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject)
  return response.data
}

const remove = async objectId => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${objectId}`, config)
  console.log(response)
  return response.data
}

export default { getAll, create, update, remove, setToken }