var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');



// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Susie2019",
    database: "bamazon"
});

displayMenu();


function displayMenu() {
    inquirer
        .prompt([
            {
                name: "toDo",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            }

        ])
        .then(function (answer) {
            if (answer.toDo === "View Products for Sale") {
                displayForManager();

            }
            else if (answer.toDo === "View Low Inventory") {
                viewLowInventory();

            }
            else if (answer.toDo === "Add to Inventory") {
                addToInventory();
            }
            else if (answer.toDo === "Add New Product") {

            }
            else if(answer.toDo === "Quit") {
                connection.end();
                process.exit();
            }

        })

}

//function to display the content of the products table for manager
function displayForManager() {

    var table = new Table({
        head: ['id', 'product_name', 'department', 'price', 'stock_quantity']
        , colWidths: [10, 35, 15, 10, 17]
    });
    // query the database for all items being on sale
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            //we will use cli-table2 package's table.push functionality to have a nice display of the database columns
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        displayMenu();

    });

};


function viewLowInventory() {
    var table = new Table({
        head: ['id', 'product_name', 'department', 'price', 'stock_quantity']
        , colWidths: [10, 35, 15, 10, 17]
    });
    // query the database for all items being on sale
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            //we will use cli-table2 package's table.push functionality to have a nice display of the database columns
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        displayMenu();

    });
}

function addToInventory() {
    inquirer
        .prompt([ //get answers from a user manager
            {
                name: "item",
                type: "input",
                message: "What is the id of the item you would like to add?"
            },
            {
                name: "number",
                type: "input",
                message: "How many items would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            //select the corresponding item to know how many items of this sort are stored
            connection.query("SELECT * FROM products WHERE ?",
                [{
                    item_id: answer.item
                }],
                function (err, res) {
                    if (err) throw err;
                    var quant = res[0].stock_quantity;
                    //the new quantity will be the stored quantity plus the number entered by a manager
                    var newQuantity = quant + parseInt(answer.number);
                    //update the corresponding record now
                    connection.query("UPDATE products SET ? WHERE ?",
                        [   
                            {
                                stock_quantity: newQuantity
                            },
                            {
                                item_id: answer.item
                            }
                        ]
                        ,
                        function (err, results) {
                            if (err) throw err;
                            console.log(+ answer.number + " items with id = " + answer.item + " are added to the inventory.")
                            displayForManager();
                        }
                    );

                });

        });
}

