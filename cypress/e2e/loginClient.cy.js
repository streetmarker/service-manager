// import cy from 'cypress'

describe('Login form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/customerForm')
    
  })
  it('enters wrong login', () => {
    cy.get('[data-cy=login]').type('1..')
    cy.get('[data-cy=password]').type('123')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
  it('enters wrong password', () => {
    cy.get('[data-cy=login]').type('1')
    cy.get('[data-cy=password]').type('1234')
    cy.get('[data-cy=submit]').click()
    cy.contains('Wrong login or password')
  })
  it('Shows content when logged in', () => {
    // cy.visit('http://localhost:3000')
    // cy.visit('https://servicemanager99.sytes.net/')
    cy.get('[data-cy=login]').type('9')
    cy.get('[data-cy=password]').type('123')
    cy.get('[data-cy=submit]').click()
    cy.contains('Ankieta Usterkowa')
    // cy.get("[data-cy=title]").should('be.visible');
  })
})
