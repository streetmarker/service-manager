

describe('Customer form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/customerForm')
    
  })
  // it('Fills customer form', () => {
  
  //   cy.get('[data-cy=login]').type('1')
  //   cy.get('[data-cy=password]').type('123')
  //   cy.wait(1000)
  //   cy.get('[data-cy=submit]').click()
  // }),
  it('Fills form', () => {
    // cy.contains('Client Login').should('not.exist');
    // cy.get('[data-cy=IndexPage]').should('not.exist');
    cy.get('[data-cy=title]').should('be.visible');
    // cy.reload()
    // cy.get('[data-cy=selectedType]')
    // cy.wait(2000)
    // cy.get('[data-cy=selectedType]').select('Naprawa ONT')
    cy.get('[data-cy=selectType]').parent().click()//.click()
    cy.get('.v-menu__content').contains('Naprawa ONT').click()
    cy.get('[data-cy=description]').type('Testowy opis zgłoszenia').should('have.value', 'Testowy opis zgłoszenia')
    
    
    cy.get('[data-cy=slot1]').parent().click()//.click()
    cy.get('.v-menu__content').contains('9-11').click()
    // cy.click()
    cy.get('[data-cy=send]').click()//.click()
    
    cy.get('.slotButton_2').click()
    cy.wait(100)
    cy.get('.v-1st_firm').should('be.visible');
    // cy.get('[data-cy=reserve]').click()

    // cy.get('[data-cy=slot2]').parent().click()//.click()
    // cy.get('.v-menu__content').contains('9-11').click()
    // cy.click()

    // cy.get('[data-cy=addSvmBtn]').click()
  })
})
