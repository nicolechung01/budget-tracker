let instructions = document.getElementById('instructions');
let initContainer = document.getElementById('init-container');
let incomeAmountButton = document.getElementById('add-income');
let expenseAmountButton = document.getElementById('add-expense');
let incomeAmount = document.getElementById('income-amount');
let expenseType = document.getElementById('expense-type');
let expenseAmount = document.getElementById('expense-amount');
let startBalanceDisp = document.getElementById('start-balance');
let expenseTotalDisp = document.getElementById('expenses-total');
let remainBalanceDisp = document.getElementById('remain-balance');
let expenseTypeButton = document.getElementById('add-expense-type');
let modal = document.getElementById('modal-window');
let exitButton = document.getElementById('exit');
let enterButton = document.getElementById('enter');
let expenseNameField = document.getElementById('expense-name');
let expenseBudgetField = document.getElementById('expense-budget');
let startBalance = 0.00;
const incomeError = document.getElementById('income-error');
const expenseTypeError = document.getElementById('expense-type-error');
const expenseAmountError = document.getElementById('expense-amount-error');
const expenseTypes = new Set();
const expenseObjects = [];
const list = document.getElementById('list');
class ExpenseObject {
    constructor() {
        this.expenseTypeContainer = document.createElement("div");
        this.expenseTypeContainer.classList.add("expense-type-container");

        this.headerContainer = document.createElement("div");
        this.headerContainer.classList.add("expense-header-container");

        this.progressBarContainer = document.createElement("div");
        this.progressBarContainer.classList.add("prog-bar-container");
        this.progressBar = document.createElement("div");
        this.progressBar.classList.add("prog-bar");
        this.progressBarContainer.appendChild(this.progressBar);

        this.numbersContainer = document.createElement("div");
        this.numbersContainer.classList.add("numbers-container");

        this.expenseName = document.createElement("div");
        this.expenseBudget = document.createElement("div");

        this.balance = 0.00;
        this.budget = 0.00;
        this.expenseBalanceDisp = document.createElement("div");
        this.expenseBalanceDisp.classList.add("expense-balance-disp");
        this.ofBudget = document.createTextNode(this.balance);
        this.ofBudgetContainer = document.createElement("div");
        this.ofBudgetContainer.classList.add("of-budget-container");
        this.remainBudget = document.createTextNode(this.budget);
        this.remainBudgetContainer = document.createElement("div");
        this.remainBudgetContainer.appendChild(this.remainBudget);
        this.remainBudgetContainer.classList.add("remain-budget-container")
        this.headerContainer.appendChild(this.expenseName);
        this.headerContainer.appendChild(this.expenseBudget);
        this.ofBudgetContainer.appendChild(this.expenseBalanceDisp);
        this.ofBudgetContainer.appendChild(this.ofBudget);
        // this.numbersContainer.appendChild(this.expenseBalanceDisp);
        this.numbersContainer.appendChild(this.ofBudgetContainer);
        this.numbersContainer.appendChild(this.remainBudgetContainer);

        this.expenseTypeContainer.appendChild(this.headerContainer);
        this.expenseTypeContainer.appendChild(this.progressBarContainer);
        this.expenseTypeContainer.appendChild(this.numbersContainer);
    
    }
    setExpenseName(name) {
        this.expenseName.textContent = name;
    }
    setExpenseBudget(budgetText, budgetVal) {
        this.budget = budgetVal;
        this.expenseBudget.textContent = "$" + budgetText;
    }
    updateBalance(num) {
        this.balance = this.balance + num;
    }
    setBalanceDisp(balance) {
        this.expenseBalanceDisp.textContent = "$" + balance;
    }
    updateBalanceDisp(newBalance) {
        this.expenseBalanceDisp.textContent =  "$" + newBalance;
    }
    updateRemainBudget(remaining) {
        this.remainBudget.textContent = "$" + remaining + " Remaining";
    }
    setOfBudget(budget) {
        this.ofBudget.textContent = "of $" + budget;
    }
    updateProgressBar() {
        const percentage = (this.balance / this.budget) * 100;
        if  (percentage > 100) {
            this.progressBar.style.width = percentage + "%";
            this.progressBar.classList.add("progress-bar-filled");
        } else {
            this.progressBar.style.width = percentage + "%";
        }
    }
}   


incomeAmountButton.addEventListener('click', function() {
    if (incomeAmount.value == "" || incomeAmount.value < 0) {
        incomeError.classList.remove("hide");
    } else {
        incomeError.classList.add("hide");
        startBalance = startBalance + parseFloat(incomeAmount.value);
        startBalanceDisp.innerHTML = "$" + startBalance;
        document.getElementById('income-amount').value = ''
    }
})

let expenseTotal = 0.00;
expenseAmountButton.addEventListener('click', function(){
    if (expenseType.value == "" || !expenseTypes.has(expenseType.value)) {
        expenseTypeError.classList.remove("hide");
    } else if (expenseAmount.value == "" || expenseAmount.value < 0) {
        expenseAmountError.classList.remove("hide");
    } else {
        expenseTypeError.classList.add("hide");
        expenseAmountError.classList.add("hide");
        expenseTotal = expenseTotal + parseFloat(document.getElementById('expense-amount').value);
        expenseTotalDisp.innerHTML = "$" + expenseTotal;
        const targetObj = findExpenseObject(expenseType.value);
        const addToBalance = parseFloat(document.getElementById('expense-amount').value);
        targetObj.updateBalance(addToBalance);
        targetObj.updateProgressBar();
        targetObj.updateBalanceDisp(targetObj.balance.toString());
        const remainingBudget = targetObj.budget - targetObj.balance;
        targetObj.updateRemainBudget(remainingBudget.toString());
        document.getElementById('expense-type').value = ''
        document.getElementById('expense-amount').value = ''
    }
})

expenseTypeButton.addEventListener('click', function() {
    modal.style.display = "block";
})
exitButton.addEventListener('click', function(){
    modal.style.display = "none";
})
enterButton.addEventListener('click', function() {
    console.log('Button clicked!');
    modal.style.display = "none";
    instructions.style.color = 'rgba(225, 225, 225, 0)';
    const name = expenseNameField.value;
    expenseTypes.add(name);
    const budgetText = expenseBudgetField.value;
    const budgetVal = parseFloat(expenseBudgetField.value);
    const expenseObject = new ExpenseObject();
    expenseObjects.push(expenseObject);
    expenseObject.balance = 0.00;
    expenseObject.setExpenseName(name);
    expenseObject.setExpenseBudget(budgetText, budgetVal);
    expenseObject.setOfBudget(budgetText);
    expenseObject.setBalanceDisp(expenseObject.balance);
    const remainingBudget = expenseObject.budget - expenseObject.balance;
    expenseObject.updateRemainBudget(remainingBudget.toString());

    list.appendChild(expenseObject.expenseTypeContainer);

    expenseNameField.value = '';
    expenseBudgetField.value = '';
})
function updateRemainingBalance() {
    let remainBalance = startBalance - expenseTotal;
    remainBalanceDisp.innerHTML = "$" + remainBalance;
}
setInterval(updateRemainingBalance, 1000);

function findExpenseObject(name) {
    return expenseObjects.find((object) => object.expenseName.textContent === name);
  }
