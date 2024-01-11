import html from './app.html?raw'
import todoStore, { Filters } from '../store/todo.store'
import { renderTodos, renderPending } from './use-cases'
import { Todo } from './models/todo.model'

const ElementIds = {

    ClearCompletedButton: '.clear-completed',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    TodoList: '.todo-list',
    PendingCountLabel: '#pending-count',

}

/**
*
*   @param {String} elementId
*
*/
export const App = ( elementId ) => {

    const displayTodos = () => {

        const todos = todoStore.getTodos( todoStore.getCurrentFilter() )
        renderTodos( ElementIds.TodoList, todos )
        updatePending()

    }

    const updatePending = () => {
        renderPending( ElementIds.PendingCountLabel )
    }

    (() => {

        const app = document.createElement( 'div' )
        app.innerHTML = html
        document.querySelector( elementId ).append( app )
        displayTodos()

    })()

    // Referencias HTML

    const newDescriptionInput = document.querySelector( ElementIds.NewTodoInput )
    const todoListUl = document.querySelector( ElementIds.TodoList )
    const clearCompletedButton = document.querySelector( ElementIds.ClearCompletedButton )
    const filtersLIs = document.querySelectorAll( ElementIds.TodoFilters )

    // Listeners

    newDescriptionInput.addEventListener( 'keyup', ( event ) => {

        if( event.keyCode !== 13 ) return;
        if( event.target.value.trim().length === 0 ) return;
        
        todoStore.addTodo( event.target.value )
        displayTodos()
        event.target.value = ''

    })

    todoListUl.addEventListener( 'click', (event) => {

        const element = event.target.closest( '[data-id]' )
        todoStore.toggleTodo( element.getAttribute( 'data-id' ) )
        displayTodos()

    })

    todoListUl.addEventListener( 'click', (event) => {
        
        const buttonDestroy = event.target.className === 'destroy'
        const element = event.target.closest( '[data-id]' )
        if( !element || !buttonDestroy ) return

        todoStore.deleteTodo( element.getAttribute( 'data-id' ) )
        displayTodos()
        
    })

    clearCompletedButton.addEventListener( 'click', () => {
        
        todoStore.deleteCompleted()
        displayTodos()
        
    })

    filtersLIs.forEach( element => {
        
        element.addEventListener( 'click', (element) => {
            filtersLIs.forEach( el => el.classList.remove( 'selected' ) )
            element.target.classList.add( 'selected' )

            switch( element.target.text ){
                case 'Todos':
                    todoStore.setFilter( Filters.All )
                    console.log( element.target.text )
                break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending )
                    console.log( element.target.text )
                break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed )
                    console.log( element.target.text )
                break;
            }

            displayTodos();

        })

    })

}