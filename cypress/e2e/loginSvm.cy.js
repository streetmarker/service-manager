// import cy from 'cypress'

describe('Login form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/mobileApp')
  })
  it('displays an error message if the email is invalid', () => {
    // cy.visit('http://localhost:3000')
    // cy.visit('https://servicemanager99.sytes.net/')
    cy.get('[data-cy=login]').type('pawel.kowal')
    cy.get('[data-cy=password]').type('pk')
    cy.get('[data-cy=submit]').click()
    // cy.contains('Wrong login or password')
    cy.contains('Panel serwisanta')
  })
  it('enters wrong login', () => {
    cy.get('[data-cy=login]').type('pawel.kowal1')
    cy.get('[data-cy=password]').type('pk')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
  it('enters wrong password', () => {
    cy.get('[data-cy=login]').type('pawel.kowal')
    cy.get('[data-cy=password]').type('pk1')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
})
