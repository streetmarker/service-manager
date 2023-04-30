// import cy from 'cypress'

describe('Login form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // cy.visit('https://servicemanager99.sytes.net/')
  })
  it('displays an error message if the email is invalid', () => {
    // cy.visit('http://localhost:3000')
    // cy.visit('https://servicemanager99.sytes.net/')
    cy.get('[data-cy=login]').type('admin')
    cy.get('[data-cy=password]').type('admin')
    cy.get('[data-cy=submit]').click()
    // cy.contains('Wrong login or password')
    cy.contains('Grafik Slotów')
  })
  it('enters wrong login', () => {
    cy.get('[data-cy=login]').type('admin1')
    cy.get('[data-cy=password]').type('admin')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
  it('enters wrong password', () => {
    cy.get('[data-cy=login]').type('admin')
    cy.get('[data-cy=password]').type('admin1')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
})
