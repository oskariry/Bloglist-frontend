describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testUser',
      password: 'password'
    }
    const unauthorized = {
      name: 'Test UnAuthorizedUser',
      username: 'unaut',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', unauthorized)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username:')
    cy.contains('password:')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      // Should be logged in so blogs title and logout button should be visible.
      // Also notification should appear
      cy.contains('blogs')
      cy.get('.notification', { timeout: 5000 }).should('contain', 'logged in')
      cy.contains('logout')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      //Should not be logged in and notification should appear
      cy.contains('Log in to application')
      cy.get('.notification', { timeout: 5000 }).should('contain', 'invalid username or password')
      cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testUser', password: 'password' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog', { timeout: 5000 }).click()
      cy.contains('create new', { timeout: 5000 })

      //From is now visible
      cy.get('.titleInput').type('Test Title')
      cy.get('.authorInput').type('Test Author')
      cy.get('.urlInput').type('Test url')
      cy.get('#create-button').click()

      //Blog should appear
      cy.contains('Test Title', { timeout: 5000 })
      cy.contains('Test Author')
      cy.contains('view')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.contains('new blog', { timeout: 50000 }).click()
        cy.createBlog({
          title: 'Test Title',
          author: 'Test Author',
          url: 'Test url'
        })
      })

      describe('and all information of blog is visible', function() {
        beforeEach(function() {
          cy.contains('Test Title', { timeout: 50000 })
          cy.contains('view').click()
        })

        it('it can be liked', function() {
          cy.get('.viewContent', { timeout: 50000 }).contains('likes 0')
          cy.get('.viewContent').contains('like').click()

          //Likes should now be increased by 1
          cy.get('.viewContent', { timeout: 50000 }).contains('likes 1')
        })

        it('it can be removed by authorized user', function() {
          cy.get('.viewContent', { timeout: 50000 }).contains('remove')
            .click()
          cy.get('.notification', { timeout: 50000 }).contains('deleted')
          cy.contains('Test Title', { timeout: 50000 }).should('not.exist')
        })
      })

      describe(' and logged in with unauthorized user', function() {
        beforeEach(function() {
          cy.contains('Test Title', { timeout: 50000 })
          cy.get('#logout-button').click()
          cy.get('#username', { timeout: 5000 }).type('unaut')
          cy.get('#password').type('password')
          cy.get('#login-button').click()
        })

        it('it cannot be removed by unauthorized user', function() {

          cy.contains('blogs', { timeout: 50000 })
          cy.contains('Test Title')
          cy.contains('view').click()
          setTimeout(() => {}, 50000)
          cy.get('.viewContent', { timeout: 5000 })
            .contains('remove')
            .click()
          cy.get('.notification', { timeout: 50000 }).contains('Invalid user')
        })

      })

    })

    describe('and many blogs exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test Title1', author: 'Test Author1', url: 'Test url1' })
        cy.createBlog({ title: 'Test Title2', author: 'Test Author2', url: 'Test url2' })
        cy.createBlog({ title: 'Test Title3', author: 'Test Author3', url: 'Test url3' })
      })

      it.only('blogs are in correct order based on likes', function() {
        //Updating Test Title3 likes
        cy.get('.blog', { timeout: 50000 }).eq(2)
          .should('contain', 'Test Title3')
          .contains('view').click()
        cy.get('.blog').eq(2)
          .should('contain', 'likes 0')
          .contains('like').click()
        cy.contains('likes 1', { timeout: 50000 })
        cy.get('.blog').first()
          .should('contain', 'likes 1')
          .contains('like').click()
        cy.contains('likes 2', { timeout: 50000 })
        // Updating Test Title2 likes
        cy.get('.blog').eq(2)
          .should('contain', 'Test Title2')
          .contains('view').click()
        cy.get('.blog').eq(2)
          .should('contain', 'likes 0')
          .contains('like').click()
        cy.contains('likes 1', { timeout: 50000 })
        // Order should be 3, 2, 1
        cy.get('.blog').eq(0).should('contain', 'Test Title3')
        cy.get('.blog').eq(1).should('contain', 'Test Title2')
        cy.get('.blog').eq(2).should('contain', 'Test Title1')
      })
    })
  })


})