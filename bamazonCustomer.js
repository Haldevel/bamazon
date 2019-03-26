var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

startConnect();

// connect to the mysql server and sql database
function startConnect() {
    connection.connect(function (err) {
        if (err) throw err;
        // run the start function after the connection is made to prompt the user
        console.log("connected as id " + connection.threadId + "\n");
        displayProducts();
    });
};


//function to select the products from the db and display the results using cli-table2 object
function displayProducts() {
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
        //the function inputs user's answers about the item to buy and ins quantity, and selects the corrsponding data from the db
        orderItem();
    });

};

// function to prompt a user to input info about purchase and to check if there are enough items to purchase in stock
function orderItem() {
    // prompt for info about the item the user wants to purchase and the number of items
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the id of the item you would like to purchase? [Quit with Q]"
            },
            {
                name: "number",
                type: "input",
                message: "How many would you like? [Quit with Q]",
                when: function (answers) {
                    return answers.item !== "Q";
                },
                validate: function (value) {
                    if (isNaN(value) === false || value === "Q") {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting check if the store has enough items to sell       
            if (answer.item === "Q" || answer.number === "Q") {
                console.log("Exiting the program...");
                connection.end();
                process.exit();
            }
            else {
                connection.query("SELECT * FROM products WHERE ?",
                    [
                        {
                            item_id: answer.item
                        }
                    ]
                    ,
                    function (err, results) {
                        if (err) throw err;
                        //if the querying was successfull               
                        //check if there are enough items to sell to a customer 
                        var numItems = results[0].stock_quantity;
                        var product = results[0].product_name;
                        var itemNum = parseInt(answer.item);
                        var userNum = parseInt(answer.number);
                        if (userNum <= numItems) {
                            //if the quantity is sufficient display the message and update the table
                            var plural = userNum === 1 ? "item" : "items";
                            console.log("Successfully purchased " + answer.number + " " + product + " " + plural + " for the sum of $" + userNum * results[0].price);
                            updateProduct(itemNum, numItems - userNum);

                        }
                        else {
                            //display the message if the quantity is insufficient
                            console.log("Sorry! Insufficient quantity in stock! Please change the order. ");
                            //display the table of items on sale...
                            displayProducts();
                        }
                    });
            }
        });
}

// function to update products table based on the item_id
function updateProduct(itemId, numberLeft) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: numberLeft
            },
            {
                item_id: itemId
            }
        ],
        function (error) {
            if (error) throw err;
            displayProducts();
        }
    );
}







