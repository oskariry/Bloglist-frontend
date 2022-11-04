import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrl = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    createBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            className='titleInput'
            type="text"
            value={title}
            name="Title"
            onChange={handleTitle}
          />
        </div>
        <div>
          author:
          <input
            className='authorInput'
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthor}
          />
        </div>
        <div>
          url:
          <input
            className='urlInput'
            type="text"
            value={url}
            name="URL"
            onChange={handleUrl}
          />
        </div>
        <button id='create-button' type="submit">create</button>
      </form>
    </div>
  )
}

CreateForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default CreateForm