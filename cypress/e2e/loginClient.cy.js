// import cy from 'cypress'

describe('Login form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/customerForm')
  })
  it('displays an error message if the email is invalid', () => {
    // cy.visit('http://localhost:3000')
    // cy.visit('https://servicemanager99.sytes.net/')
    cy.get('[data-cy=login]').type('1')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=submit]').click()
    // cy.contains('Wrong login or password')
    cy.contains('Ankieta Usterkowa')
  })
  it('enters wrong login', () => {
    cy.get('[data-cy=login]').type('1..')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
  it('enters wrong password', () => {
    cy.get('[data-cy=login]').type('1')
    cy.get('[data-cy=password]').type('password1234')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
})
