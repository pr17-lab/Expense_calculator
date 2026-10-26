
let expenseForm = document.getElementById("expenseForm");
let category = document.getElementById("category");
let amount = document.getElementById("amount");
let date = document.getElementById("date");
let expenseDetails = document.getElementById("expenseDetails");
let addBtn = document.getElementById("addBtn");
let cancelBtn = document.getElementById("cancelBtn");
let totalExpenses = document.getElementById("totalExpenses");
let filterCategory = document.getElementById("filterCategory");


let expenses = JSON.parse(sessionStorage.getItem("expenses")) || [];
let editIndex = -1;

expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let expense = {
        category: category.value,
        amount: Number(amount.value),
        date: date.value
    };

    if (
        expense.category === "" ||
        !Number.isFinite(expense.amount) ||
        expense.amount <= 0 ||
        expense.date === ""
    ) {
        alert("Please enter valid expense details.");
        return;
    }

    if (editIndex === -1) {

        expenses.push(expense);

    } else {
        expenses[editIndex] = expense;

    }

    saveExpenses();
    expenseForm.reset();
    editIndex = -1;

    addBtn.textContent = "Add Expense";
    cancelBtn.classList.add("d-none");

    displayExpenses();

});


function displayExpenses(list = expenses) {

    expenseDetails.innerHTML = "";

    if (list.length === 0) {

        expenseDetails.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No expenses found
                </td>
            </tr>
        `;
    } else {

        list.forEach(function (expense) {

            let index = expenses.indexOf(expense);

            expenseDetails.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${expense.category}</td>
                    <td>₹${expense.amount.toFixed(2)}</td>
                    <td>${expense.date}</td>

                    <td>
                        <button class="btn btn-warning btn-sm"
                            onclick="editExpense(${index})">
                            Edit
                        </button>

                        <button class="btn btn-danger btn-sm"
                            onclick="deleteExpense(${index})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

        });

    }
    calculateTotal();
}


function editExpense(index) {

    let expense = expenses[index];
    category.value = expense.category;
    amount.value = expense.amount;
    date.value = expense.date;
    editIndex = index;
    addBtn.textContent = "Update Expense";
    cancelBtn.classList.remove("d-none");    

}


cancelBtn.addEventListener("click", function () {

    expenseForm.reset();
    editIndex = -1;
    addBtn.textContent = "Add Expense";
    cancelBtn.classList.add("d-none");

});


// DELETE EXPENSE
function deleteExpense(index) {
    let confirmDelete = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (confirmDelete) {
        expenses.splice(index, 1);
        if (editIndex === index) {
            expenseForm.reset();
            editIndex = -1;
            addBtn.textContent = "Add Expense";
            cancelBtn.classList.add("d-none");

        } else if (editIndex > index) {
            editIndex--;
        }

        saveExpenses();
        displayExpenses();

    }

}



function calculateTotal() {
    let total = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    totalExpenses.textContent = total.toFixed(2);

}


function filterExpenses() {
    let selectedCategory = filterCategory.value;
    let filteredExpenses = expenses.filter(function (expense) {
        return selectedCategory === "" ||
            expense.category === selectedCategory;
    });

    displayExpenses(filteredExpenses);

}


function saveExpenses() {
    sessionStorage.setItem("expenses", JSON.stringify(expenses));
}

filterCategory.addEventListener("change", filterExpenses);

displayExpenses();