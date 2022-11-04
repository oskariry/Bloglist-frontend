import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Tests of blog component', () => {
  const user = {
    name: 'Test name',
    username: 'TestUser',
    password: 'password'
  }

  const blog = {
    id: '006622',
    title: 'Test Title',
    author: 'Test author',
    url: 'Test url',
    likes: 2,
    user: user
  }

  let mockLikeHandler
  let mockRemoveHandler
  let component

  beforeEach(() => {
    mockRemoveHandler = jest.fn()
    mockLikeHandler = jest.fn()
    component = render(<Blog key={blog.id} blog={blog} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler}/>)
  })

  test('Render default content and url and likes are hidden', () => {
    //const component = render(<Blog key={blog.id} blog={blog} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler}/>)

    const elementTitle = screen.queryByText('Test Title')
    const elementAuthor = screen.queryByText('Test author')
    const div = component.container.querySelector('.viewContent')
    expect(elementTitle).toBeDefined()
    expect(elementAuthor).toBeDefined()
    expect(div).toHaveStyle('display: none')
    expect(div).toHaveTextContent('Test url')
    expect(div).toHaveTextContent('likes 2')
  })

  test('All blog data will be visible after view button is clicked', async () => {
    //const component = render(<Blog key={blog.id} blog={blog} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const elementTitle = screen.queryByText('Test Title')
    const elementAuthor = screen.queryByText('Test author')
    const div = component.container.querySelector('.viewContent')
    expect(elementTitle).toBeDefined()
    expect(elementAuthor).toBeDefined()
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('Test url')
    expect(div).toHaveTextContent('likes 2')
  })

  test('When pressing like button twice handlerFunction will be called twice', async () => {
    //const component = render(<Blog key={blog.id} blog={blog} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler}/>)
    const user = userEvent.setup()

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    expect(mockLikeHandler.mock.calls).toHaveLength(1)
    await user.click(likeButton)
    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })

})