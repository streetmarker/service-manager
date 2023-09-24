// import cy from 'cypress'

describe('Login form', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/subcontractorManager')
    })
    it('add serviceman', () => {
      // cy.visit('http://localhost:3000')
      // cy.visit('https://servicemanager99.sytes.net/')
        cy.get('[data-cy=firmSelect]').click()
        cy.get('.v-list-item__title').contains('KFC').click()
        // cy.contains('Dodawanie podwykonawcy do bazy danych')
        cy.get('[data-cy=addSvmBtn]').click()
        cy.contains('Dodawanie technika do firmy')
        
        cy.get('[data-cy=svmLogin]').type('wojtekkkk').should('have.value', 'wojtekkkk')
        cy.get('[data-cy=svmEmail]').type('wojtek@emlail.com').should('have.value', 'wojtek@emlail.com')
        cy.get('[data-cy=svmQualifications]').click()
        cy.get('.v-list-item__title').contains('U').click()
        cy.get('.v-list-item__title').contains('Uszkodzenie okablowania na posesji').click()
        // cy.get('[data-cy=svmQalifications]').should('have.text', 'Uszkodzenie okablowania w lokalu, Uszkodzenie okablowania na posesji'); // verify that all options are displayed in the select component
        cy.get('[data-cy=svmLogin]').click()
        cy.get('[data-cy=saveAddSvm]').click()
        cy.contains('200')
        cy.get('[data-cy=exitAddSvm]').click()
    })
  })
  