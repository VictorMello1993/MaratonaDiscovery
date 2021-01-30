//Janela de modal
const Modal = {
    open() {
        const modal = document.getElementById('modal-overlay')
        modal.classList.add('active')
    },
    close() {
        const modal = document.querySelector('.modal-overlay')
        modal.classList.remove('active')
    }

    /*Desafio: criar a função única que chama a função da DOM "toggle" que abre a janela se não tiver a class 'active'
               e fechar se existir a class 'active'*/
}

const transactions = [
    {     
        description: 'Luz',
        amount: -500001,
        date: '23/01/2021',
    },
    {     
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
    },
    {     
        description: 'Internet',
        amount: -20012,
        date: '23/01/2021',
    },
    {        
        description: 'App',
        amount: -2000,
        date: '23/01/2021',
    }
]

//1) Somar as entradas (incomes)
//2) Somar as saídas (expenses)
//3) Remover das entradas o valor das saídas
const Transaction = {
    all: transactions,
    add(transaction){
        this.all.push(transaction)
        App.reload()
    },
    remove(index){
        this.all.splice(index, 1)
        App.reload()
    },
    incomes() {
        let income = 0

        this.all.forEach(transaction => {
            if(transaction.amount > 0){
                income += transaction.amount
            }
        })
        
        //Minha resolução
        // income = Utils.formatCurrency(income)
        
        return income
    },
    expenses() {
        let expense = 0

        this.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })        

        //Minha resolução
        // expense = Utils.formatCurrency(expense)

        return expense
    },
    total() {
        //Entradas - saídas                
        //---------------------------Minha resolução-----------------------------------------------------------------------------------------------
        // let incomes = Number(this.incomes().replace(/\D/g, ''))
        // let expenses = Number(this.expenses().replace(/\D/g, ''))
        
        // let total = incomes - expenses

        // total = Utils.formatCurrency(total)

        // return total
        //-----------------------------------------------------------------------------------------------

        return this.incomes() + this.expenses()
    }
}

//Substituir os dados do HTML com os dados do JS
const DOM = {    
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){                
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        
        DOM.transactionContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CSSClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount) 

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/minus.svg" alt="Remover transação">
        </td>`

        return html
    },
    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions(){
        DOM.transactionContainer.innerHTML = ''
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')
        value = Number(value) / 100

        //Adaptando a formatação de moeda para o padrão brasileiro (culture = 'pt-br', BRL (Real))
        value = value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL' 
        })     

        return signal + value
    }
}

const App = {
    init(){
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()        
    },
    reload(){
        DOM.clearTransactions()
        this.init()
    },
}

App.init()

Transaction.add({    
    description: 'TESTE',
    amount: 200,
    date: '23/01/2021'
})