// import cy from 'cypress'

describe('Login form', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/subcontractorManager')
    })
    it('add serviceman', () => {
      // cy.visit('http://localhost:3000')
      // cy.visit('https://servicemanager99.sytes.net/')
        cy.get('[data-cy=firmSelect]').click()
        cy.get('.v-list-item__title').contains('KFC TEST').click()
        cy.get('[data-cy=addSvmBtn]').click()
        
        cy.get('[data-cy=svmLogin]').type('testowyjan').should('have.value', 'testowyjan')
        cy.get('[data-cy=svmEmail]').type('testowyjan@email.com').should('have.value', 'testowyjan@email.com')
        // cy.get('[data-cy=svmQalifications]').click()
        // // cy.get('.v-list-item__title').click()
        // cy.get('.v-list-item__action').each(($el) => {
        //     cy.wrap($el).click(); // select each option in the dropdown
        //   });
        cy.get('[data-cy=svmQalifications]').click()
        cy.get('.v-list-item__title').contains('U').click()
        cy.get('.v-list-item__title').contains('Uszkodzenie okablowania na posesji').click()

            //   .each(($select) => { // select each v-select component
                // cy.get('.v-list-item').each(($el) => { // select each option in the dropdown for the current select component
                //   cy.wrap($el).click();
                // });
                // cy.wrap($select).parent().find('.v-select__selection').should('have.text', 'Option 1, Option 2, Option 3'); // verify that all options are displayed in the select component
            //   });
          
        // cy.get('[data-cy=svmQalifications]').should('have.text', 'Uszkodzenie okablowania w lokalu, Uszkodzenie okablowania na posesji'); // verify that all options are displayed in the select component
        cy.get('[data-cy=svmLogin]').click()
        cy.get('[data-cy=saveAddSvm]').click()
        cy.contains('200')
        cy.get('[data-cy=exitAddSvm]').click()

      
    //   cy.get('[data-cy=password]').type('password123')
    //   cy.get('[data-cy=submit]').click()
    //   cy.contains('Dodawanie technika do firmy')
    //   cy.contains('Dodawanie podwykonawcy do bazy danych')
    })
  })
  