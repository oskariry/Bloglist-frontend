import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateForm from './components/CreateForm'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [color, setColor] = useState('')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(function(a,b) {return b.likes-a.likes}) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const currentUser = JSON.parse(loggedUserJSON)
      setUser(currentUser)
      blogService.setToken(currentUser.token)
    }
  },[])

  const createFormRef = useRef()

  const notificationInfo = (message, col) => {
    setColor(col)
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const userFromServer = await loginService.login({
        username, password,
      })
      console.log(userFromServer)
      console.log(JSON.stringify(userFromServer))
      window.localStorage.setItem('loggedUser', JSON.stringify(userFromServer))
      blogService.setToken(userFromServer.token)
      setUser(userFromServer)
      notificationInfo(`${userFromServer.name} logged in`, 'green')
    } catch (exeption) {
      console.log(exeption)
      notificationInfo(exeption.response.data.error, 'red')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    const userData = JSON.parse(window.localStorage.getItem('loggedUser'))
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
    notificationInfo(`${userData.name} logged out`, 'green')
  }

  const handleCreate = async (newBlog) => {
    if (user !== null) {
      try{
        await blogService.create(newBlog)
        createFormRef.current.toggleVisibility()
        const allBlogs = await blogService.getAll()
        //setBlogs(blogs.concat(newBlog).sort(function(a,b) {return b.likes-a.likes}))
        setBlogs(allBlogs.sort(function(a,b) {return b.likes-a.likes}))
        notificationInfo(`a new blog ${newBlog.title} by ${newBlog.author}`, 'green')
      }catch (exeption) {
        if (exeption.response.data.error === 'Login expired') {
          window.localStorage.removeItem('loggedUser')
          setUser(null)
          blogService.setToken(null)
        }
        notificationInfo(exeption.response.data.error, 'red')
        console.log(exeption)
      }
    }else {
      notificationInfo('You need to login to create a blog', 'red')
    }
  }

  const handleLike = async (blogId, updatedBlog) => {
    const newBlog = await blogService.update(blogId, updatedBlog)
    const newBlogs = blogs.map(blog => {
      if (blog.id === blogId) {
        return newBlog
      }else {
        return blog
      }
    })
    console.log(newBlogs)
    setBlogs(newBlogs.sort(function(a,b) {return b.likes-a.likes}))
  }

  const handleRemove = async (blogId, blogToDelete) => {
    if(window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      try{
        const deletedBlog = await blogService.remove(blogId)
        console.log(deletedBlog)
        const newBlogs = blogs.filter(blog => blog.id !== blogId)
        setBlogs(newBlogs)
        notificationInfo(`${blogToDelete.title} by ${blogToDelete.author} deleted`, 'green')
      } catch (exeption) {
        if (exeption.response.data.error === 'Login expired') {
          window.localStorage.removeItem('loggedUser')
          setUser(null)
          blogService.setToken(null)
        }
        notificationInfo(exeption.response.data.error, 'red')
      }
    }
  }

  const loginForm = () => (
    <Login handleLogin={handleLogin}/>
  )

  const blogForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button type="button" onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel='new blog' ref={createFormRef}>
          <CreateForm createBlog={handleCreate}/>
        </Togglable>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleRemove={handleRemove}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification} notificationColor={color}/>
      {
        user === null
          ? loginForm()
          : blogForm()
      }
    </div>
  )
}

export default App
