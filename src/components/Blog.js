import { useState } from 'react'


const Blog = ({ blog, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const like = (event) => {
    event.preventDefault()
    const updatedBlog = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    handleLike(blog.id, updatedBlog)
  }

  const remove = (event) => {
    event.preventDefault()
    const blogToDelete = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    handleRemove(blog.id, blogToDelete)
  }

  return(
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
        <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='viewContent'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={like}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <button onClick={remove}>remove</button>
      </div>
    </div>
  )
}

export default Blog