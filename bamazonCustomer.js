var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');

var table = new Table({
    head: ['id', 'product_name', 'department', 'price', 'stock_quantity']
    , colWidths: [10, 35, 15, 10, 17]
});


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

function displayProducts() {
    // query the database for all items being on sale
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            //we will use cli-table2 package's table.push functionality to have a nice display of the database columns
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
            //console.log(res[i].item_id + "   " + res[i].product_name + "   " + res[i].department_name + "    " + res[i].price + "    " + res[i].stock_quantity  );
        }
        console.log(table.toString());
        //the function inputs user's answers about the item to buy and ins quantity, and selects the corrsponding data from the db
        orderItem();

        //prompt a user 
    });

};

// function to handle 
function orderItem() {
    // prompt for info about the item the user wants to purchase and the number of items
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the id of the item you would like to purchase?"
            },
            {
                name: "number",
                type: "input",
                message: "How many would you like?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting check if the store has enough items to sell
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
                    console.log("The info about the item: " + results[0].product_name + " " + results[0].price + " " + results[0].stock_quantity);
                    //connection.end();
                    //check if there are enough items to sell to a customer 
                    var numItems = results[0].stock_quantity;
                    var product= results[0].product_name;
                    if(parseInt(answer.number) <= numItems) {
                        console.log("Successfully purchased " + answer.number+ " " + product + " items");
                        //connection.end();
                        //startConnect();
                        //console.log(table.toString());
                    }
                    else {
                        console.log("Sorry! Insufficient quantity in stock! Please change the order. ");
                        //display the table of items on sale...
                        //displayProducts();
                        //connection.end();
                        console.log(table.toString());
                        orderItem();

                    }
                    
                });
        });   

};


    // function which prompts the user for what action they should take
    function start() {
                inquirer
                    .prompt({
                        name: "postOrBid",
                        type: "input",
                        message: "What is the project Id would you like to buy?",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    })
                    .then(function (answer) {
                        // based on their answer, either call the bid or the post functions
                        if (answer.postOrBid === "POST") {
                            postAuction();
                        }
                        else if (answer.postOrBid === "BID") {
                            bidAuction();
                        } else {
                            connection.end();
                        }
                    });
            }




