var mysql = require("mysql");
var inquirer = require("inquirer");

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


// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

function displayProducts() {
    // query the database for all items being on sale
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        console.log("id  |  product_name   | department  | price | stock_quantity" );
        console.log("---- ----------------- ------------- ------- ---------------")
        for(var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "   " + res[i].product_name + "   " + res[i].department_name + "    " + res[i].price + "    " + res[i].stock_quantity  );
        }
        connection.end();
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




