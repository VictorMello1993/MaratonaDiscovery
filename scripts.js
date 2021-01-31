//Janela de modal
const Modal = {
    open() {
        const modal = document.querySelector('.modal-overlay')
        modal.classList.add('active')
    },
    close() {
        const modal = document.querySelector('.modal-overlay')
        modal.classList.remove('active')
    }

    /*Desafio: criar a função única que chama a função da DOM "toggle" que abre a janela se não tiver a class 'active'
               e fechar se existir a class 'active'*/
}

//Armazenamento de dados no navegador (Local Storage)
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions){
        localStorage.setItem('dev.finances:transactions', 
                              JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        this.all.push(transaction)
        App.reload()
    },

    remove(index) {
        this.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0

        this.all.forEach(transaction => {
            if (transaction.amount > 0) {
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
            if (transaction.amount < 0) {
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

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>`

        return html
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionContainer.innerHTML = ''
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')
        value = Number(value) / 100

        //Adaptando a formatação de moeda para o padrão brasileiro (culture = 'pt-br', BRL (Real))
        value = value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value
    },

    formatAmount(value) {
        value = Number(value) * 100
        return value
    },

    formatDate(value) {
        const splittedDate = value.split('-')
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    validateFields() {
        //Atribuição destructuring
        const { description, amount, date } = this.getValues()

        if (description.trim() === '' ||
            amount.trim() === '' ||
            date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos!')
        }
    },

    formatValues() {
        //Atribuição destructuring
        let { description, amount, date } = this.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        this.description.value = ''
        this.amount.value = ''
        this.date.value = ''
    },

    //Gravação dos dados do formulário
        //1) Verificar se os campos foram preenchidos
        //2) Formatar os dados para salvar
        //3) Salvar
        //4) Limpar os campos para que no futuro sejam inseridos novos dados
        //5) Fechar o modal
        //6) Atualizar a aplicação
    submit(event) {
        event.preventDefault()

        try {
            this.validateFields()
            const transaction = this.formatValues()
            Transaction.add(transaction)
            this.clearFields()
            Modal.close()            
        } catch (error) {
            alert(error.message)
        }

        this.formatValues()        
    }
}

Storage.get()

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        this.init()
    },
}

App.init()
