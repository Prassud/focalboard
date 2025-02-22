// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable max-nested-callbacks */

/// <reference types="Cypress" />

describe('Create and delete board / card', () => {
    const timestamp = new Date().toLocaleString();
    const boardTitle = `Test Board (${timestamp})`;
    const cardTitle = `Test Card (${timestamp})`;

    beforeEach(() => {
        localStorage.setItem('focalboardSessionId', 'TESTTOKEN');
        localStorage.setItem('language', 'en');
        cy.expect(localStorage.getItem('focalboardSessionId')).to.eq('TESTTOKEN');
        localStorage.setItem('welcomePageViewed', 'true');
    });

    it('Can create and delete a board and card', () => {
        cy.visit('/');
        cy.contains('+ Add board').click({force: true});
        cy.contains('Empty board').click({force: true});
        cy.get('.BoardComponent').should('exist');
    });

    it('Can set the board title', () => {
        // Board title
        cy.get('.Editable.title').
            type(boardTitle).
            type('{enter}').
            should('have.value', boardTitle);
    });

    it('Can hide and show the sidebar with active board', async () => {
        // Hide and show the sidebar option available on mobile devices
        cy.viewport(767, 1024);
        cy.get('.sidebarSwitcher').click();
        cy.get('.Sidebar .heading').should('not.exist');
        cy.get('.Sidebar .show-button').click();
        cy.get('.Sidebar .heading').should('exist');

        cy.viewport(1024, 1024);
        cy.get('.sidebarSwitcher').should('not.exist');
    });

    it('Can rename the board view', () => {
        // Rename board view
        const boardViewTitle = `Test board (${timestamp})`;
        cy.get('.ViewHeader>.Editable[title=\'Board view\']').should('exist');
        cy.get('.ViewHeader>.Editable').
            clear().
            type(boardViewTitle).
            type('{esc}');

        cy.get(`.ViewHeader .Editable[title='${boardViewTitle}']`).should('exist');
    });

    it('Can create a card', () => {
        // Create card
        cy.get('.ViewHeader').contains('New').click();
        cy.get('.CardDetail').should('exist');
    });

    it('Can set the card title', () => {
        // Card title
        cy.get('.CardDetail .EditableArea.title').
            type(cardTitle).
            type('{enter}').
            should('have.value', cardTitle);

        // Close card
        cy.get('.Dialog.dialog-back .wrapper').click({force: true});
    });

    it('Can create a table view', () => {
        // Create table view
        // cy.intercept('POST', '/api/v1/blocks').as('insertBlocks');
        cy.get('.ViewHeader').get('.DropdownIcon').first().parent().click();
        cy.get('.ViewHeader').contains('Add view').click();
        cy.get('.ViewHeader').contains('Add view').click();
        cy.get('.ViewHeader').contains('Add view').parent().contains('Table').click();

        // cy.wait('@insertBlocks');

        // Wait for round-trip to complete and DOM to update
        cy.get('.ViewHeader .Editable[title=\'Table view\']').should('exist');

        // Card should exist in table
        cy.get(`.TableRow [value='${cardTitle}']`).should('exist');
    });

    it('Can rename the table view', () => {
        // Rename table view
        const tableViewTitle = `Test table (${timestamp})`;
        cy.get('.ViewHeader .Editable[title=\'Table view\']').
            clear().
            type(tableViewTitle).
            type('{esc}');

        cy.get(`.ViewHeader .Editable[title='${tableViewTitle}']`).should('exist');
    });

    it('Can sort the table', () => {
        // Sort
        cy.get('.ViewHeader').contains('Sort').click();
        cy.get('.ViewHeader').contains('Sort').parent().contains('Name').click();
    });

    it('Can delete the board', () => {
        // Delete board
        cy.get('.Sidebar .octo-sidebar-list').
            contains(boardTitle).first().
            next().
            find('.Button.IconButton').
            click({force: true});

        cy.contains('Delete board').click({force: true});

        cy.get('.DeleteBoardDialog button.danger').click({force: true});

        // Board should not exist
        cy.contains(boardTitle).should('not.exist');
    });
});
