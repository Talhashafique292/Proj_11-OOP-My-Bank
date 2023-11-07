#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";

class Customer{
    firstName: string
    lastName: string
    age: number
    gender: string
    mobNumber: number
    accNumber: number

    constructor(fName: string, lName: string, age: number, gender: string, mNumber: number, aNumber: number) {
    
        this.firstName = fName
        this.lastName = lName
        this.age = age
        this.gender = gender
        this.mobNumber = mNumber
        this.accNumber = aNumber
    }
    
}

interface BankAccount {
    accNumber: number;
    balance: number;

}

class Bank {
    customer: Customer[] = [];
    account: BankAccount[] = [];

    addCustomer(obj: Customer) {
        this.customer.push(obj);
    };

    addAccNumber(obj: BankAccount) {
        this.account.push(obj);
    }
    transaction(accobj: BankAccount) {
        let newAccounts = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
        this.account = [...newAccounts, accobj];
    }
}

let myBank = new Bank();

for (let i: number = 1; i <= 3; i++){
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number());
    const cus = new Customer(fName,lName,20 * i,"male",num,10000+i);
    
    myBank.addCustomer(cus);
    myBank.addAccNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}

async function bankService(bank:Bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the service",
            choices: ["view Balance", "cash Withdraw", "cash Deposit", "Exit"],
        });
    
        if (service.select == "view Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number: ",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.blue.bold(name?.firstName)} ${chalk.blue.bold(name?.lastName)} your account balance is ${chalk.bold.greenBright(`$${account.balance}`)}`);
            }
        } 
    
        if (service.select == "cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number: ",
            }); 
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your ammount",
                    name: "rupee"
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Your Current ballance is insufficient"))
                }
                let newBalance = account.balance - ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                
            }
        }
        
        if (service.select == "cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number: ",
            }); 
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your ammount",
                    name: "rupee"
                });
                let newBalance = account.balance + ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                
            }
        }
        if (service.select == "Exit") {
            return;
        }
     }
    while(true)
}

bankService(myBank); 