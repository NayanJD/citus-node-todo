const Company = require('./models/company')
const models = require('./models')
const {faker} = require('@faker-js/faker')

async function testCompany() {
    // const companies = await models.sequelize.models.Company.findAll();
    // const todos = await models.sequelize.models.Todo.findAll();
    
    const companies = [];

    for(let i = 0; i < 5; i++){
        companies.push(await models.sequelize.models.Company.create({
            name: faker.company.companyName()
        }))
    }

    for(let company of companies){
        for(let i = 0; i < 1000; i++){
            await models.sequelize.models.Todo.create({
                content: faker.lorem.sentence(),
                companyId: company.id
            })
        }
    }


    // console.log(todos)
}

testCompany()