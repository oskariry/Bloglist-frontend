import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'


describe('Tests of createFrom component', () => {

  test('When pressing create button, onSubmit function will have correct data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = jest.fn()

    const component = render(<CreateForm createBlog={mockOnSubmit}/>)

    const titleInput = component.container.querySelector('.titleInput')
    const authorInput = component.container.querySelector('.authorInput')
    const urlInput = component.container.querySelector('.urlInput')
    const likeButton = screen.getByText('create')

    await user.type(titleInput, 'Test title')
    await user.type(authorInput, 'Test author')
    await user.type(urlInput, 'Test url')
    await user.click(likeButton)

    expect(mockOnSubmit.mock.calls).toHaveLength(1)

    const data = mockOnSubmit.mock.calls[0][0]
    expect(data.title).toBe('Test title')
    expect(data.author).toBe('Test author')
    expect(data.url).toBe('Test url')
  })

})