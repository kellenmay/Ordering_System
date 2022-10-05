const { ApolloServer, gql } = require("apollo-server");
const database = require("./database");

const typeDefs = gql`

  type Customer {
    id: ID #done
    name: String #done
    address: String #done
    email: String #done
    phoneNumber: String #done
    invoices: [Invoice!] #done
  }

  type Inventory {
    id: ID #done
    itemNumber: String #done
    make: String #done
    msrp: Float #done
    description: String #done
  }

  type InvoiceItem {
    id: ID #done
    lineNumber: Int
    invoice: Invoice #done
    item: Inventory #done
    quantity: Int #done
    price: Float #done
  }

  type Invoice {
    id: ID #done
    customer: Customer #done
    dateOfSale: String #done
    lines: [InvoiceItem!] #done
  }

  type Query {
    customers: [Customer] #done
    inventories: [Inventory] #done
    invoices: [Invoice] #done
    customer(id: ID!): Customer #done
    invoice(id: ID!): Invoice #done
    inventory(id: ID!): Inventory #done
  }

  input CreateCustomerArgs {
    name: String! 
    address: String! 
    email: String! 
    phoneNumber: String! 
  }

  input UpdateCustomerArgs {
    id: ID!
    name: String
    address: String 
    email: String
    phoneNumber: String
  }

  type CustomerReturn {
    customer: Customer
    success: Boolean
  }

  input CreateInventoryArgs {
    itemNumber: String 
    make: String 
    msrp: Float 
    description: String 
  }

  input UpdateInventoryArgs {
    id: ID!
    itemNumber: String 
    make: String 
    msrp: Float 
    description: String 
  }

  type InventoryReturn {
    inventory: Inventory
    success: Boolean
  }

  input CreateInvoiceArgs {
    customerId: ID 
    dateOfSale: String 
  }

  input UpdateInvoiceArgs {
    id: ID!
    customerId: ID 
    dateOfSale: String 
  }

  type InvoiceReturn {
    invoice: Invoice
    success: Boolean
  }

  input CreateInvoiceItemArgs {
    invoice: Int 
    lineNumber: Int
    item: Int 
    quantity: Int 
    price: Float 
  }

  input UpdateInvoiceItemArgs {
    invoice: Int 
    lineNumber: Int
    item: Int 
    quantity: Int 
    price: Float 
  }

  type InvoiceItemReturn {
    invoiceItem: InvoiceItem
    success: Boolean
  }

  type Mutation {
    createCustomer(args: CreateCustomerArgs!): CustomerReturn
    createInventory(args: CreateInventoryArgs!): InventoryReturn
    createInvoice(args: CreateInvoiceArgs!): InvoiceReturn
    createInvoiceItem(args: CreateInvoiceItemArgs!): InvoiceItemReturn
    deleteCustomer(id: ID!): Boolean
    deleteInvoice(id: ID!): Boolean
    deleteInventory(id: ID!): Boolean
    deleteInvoiceItem(invoiceNumber: Int!, lineNumber: Int!): Boolean
    updateCustomer(args: UpdateCustomerArgs!): CustomerReturn
    updateInventory(args: UpdateInventoryArgs!): InventoryReturn
    updateInvoice(args: UpdateInvoiceArgs!): InvoiceReturn
    updateInvoiceItem(args: UpdateInvoiceItemArgs!): InvoiceItemReturn
  }
`;

class Customer {
  _id;
  _name;
  _address;
  _email;
  _phone_number;

  constructor(args) {
    this._id = args.id;
    this._name = args.name;
    this._address = args.address;
    this._email = args.email;
    this._phone_number = args.phone_number;
  }

  id() {
    return this._id;
  }
  name() {
    return this._name;
  }
  address() {
    return this._address;
  }
  email() {
    return this._email;
  }
  phoneNumber() {
    return this._phone_number;
  }
  invoices(args, context) {
    const database = context.db;

    return database
      .promise(`SELECT * FROM invoice WHERE invoice.customer_id = ${this._id}`)
      .then((result) => {
        const data = JSON.parse(JSON.stringify(result));
        return data;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((invoices) => {
        const result = [];
        for (let i = 0; i < invoices.length; i++) {
          result.push(new Invoice(invoices[i]));
        }
        return result;
      });
  }
}

class Inventory {
  _id;
  _item_number;
  _make;
  _msrp;
  _item_description;

  constructor(args) {
    this._id = args.id;
    this._item_number = args.item_number;
    this._make = args.make;
    this._msrp = args.msrp;
    this._item_description = args.item_description;
  }

  id() {
    return this._id;
  }
  itemNumber() {
    return this._item_number;
  }
  make() {
    return this._make;
  }
  msrp() {
    return this._msrp;
  }
  description() {
    return this._item_description;
  }
}

class InvoiceItem {
  _invoice_number;
  _line_number;
  _item_id;
  _quantity;
  _price;

  constructor(args) {
    this._invoice_number = args.invoice_number;
    this._line_number = args.line_number;
    this._item_id = args.item_id;
    this._quantity = args.quantity;
    this._price = args.price;
  }

  id() {
    return `"Invoice Number" + ${this._invoice_number}|"Line number" + ${this._line_number}`;
  }
  lineNumber(){
    return this._line_number
  }
  invoice(args, context) {
    const database = context.db;

    return database
      .promise(`SELECT * FROM invoice WHERE invoice.id = ${this._invoice_number}`)
      .then((result) => {
        const data = JSON.parse(JSON.stringify(result));
        return data;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((invoice) => {
        const result = [];
        for (let i = 0; i < invoice.length; i++) {
          result.push(new Invoice(invoice[i]));
        }
        return result[0];
      });
  }
  item(args, context) {
    const database = context.db;

    return database
      .promise(`SELECT * FROM inventory WHERE inventory.item_number = ${this._item_id}`)
      .then((result) => {
        const data = JSON.parse(JSON.stringify(result));
        return data;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((inventory) => {
        const result = [];
        for (let i = 0; i < inventory.length; i++) {
          result.push(new Inventory(inventory[i]));
        }
        return result[0];
      });
  }
  
  quantity() {
    return this._quantity;
  }
  price() {
    return this._price;
  }
}

class Invoice {
  _id;
  _customer_id;
  _date_of_sale;

  constructor(args) {
    this._id = args.id;
    this._customer_id = args.customer_id;
    this._date_of_sale = args.date_of_sale;
  }

  id() {
    return this._id;
  }
  
  customer(args, context) {
    const database = context.db;
    // console.log(this._customer_id)
    return database
      .promise(
        `SELECT * FROM customer WHERE customer.id = ${this._customer_id}`
      )
      .then((result) => {
        const data = JSON.parse(JSON.stringify(result));
        return data;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((customers) => {
        return new Customer(customers[0]);
      });
  }
  dateOfSale() {
    return this._date_of_sale;
  }
  lines(args, context) {
    const database = context.db;

    return database
      .promise(`SELECT * FROM invoice_item WHERE invoice_item.invoice_number = ${this._id}`)
      .then((result) => {
        const data = JSON.parse(JSON.stringify(result));
        return data;
      })
      .catch((err) => {
        console.log(err);
      })
      .then((invoiceItems) => {
        const result = [];
        for (let i = 0; i < invoiceItems.length; i++) {
          result.push(new InvoiceItem(invoiceItems[i]));
        }
        return result;
      });
  }
}

const resolvers = {
  Query: {
    customers: () => {
      return database
        .promise("SELECT * FROM customer")
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result));
          return data;
        })
        .catch((err) => {
          console.log(err);
        })
        .then((customers) => {
          const result = [];
          for (let i = 0; i < customers.length; i++) {
            result.push(new Customer(customers[i]));
          }
          return result;
        });
    },  
    customer: (obj, args) => {
      return database
        .promise(`SELECT * FROM customer WHERE customer.id = ${args.id}`)
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result));
          return data;
        })
        .catch((err) => {
          console.log(err);
        })
        .then(([customer]) => {
        //   const result = [];
        //   for (let i = 0; i < customers.length; i++) {
        //     if (customers[i].id == args.id){
        //       result.push(new Customer(customers[i]));
        //     }
        //   }
        // return result[0];
        // console.log(customer);
        return new Customer(customer);
        });
    },  
    inventories: () => {
      return database
        .promise("SELECT * FROM inventory")
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result));
          return data;
        })
        .catch((err) => {
          console.log(err);
        })
        .then((inventories) => {
          const result = [];
          for (let i = 0; i < inventories.length; i++) {
            result.push(new Inventory(inventories[i]));
          }
          return result;
        });
    },
    inventory: (obj, args) => {
      return database
        .promise(`SELECT * FROM inventory WHERE inventory.id = ${args.id}`)
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result));
          return data;
        })
        .catch((err) => {
          console.log(err);
        })
        .then((inventories) => {
          const result = [];
          for (let i = 0; i < inventories.length; i++) {
            if (inventories[i].id == args.id){
              result.push(new Inventory(inventories[i]));
            }
          }
          return result[0];
        });
    },
    invoices: () => {
      return database
        .promise("SELECT * FROM invoice")
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result));
          return data;
        })
        .catch((err) => {
          console.log(err);
        })
        .then((invoices) => {
          const result = [];
          for (let i = 0; i < invoices.length; i++) {
            result.push(new Invoice(invoices[i]));
          }
          return result;
        });
    },
    invoice: (obj, args) => {
      return database
        .promise(`SELECT * FROM invoice WHERE invoice.id = ${args.id}`)
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result));
          return data;
        })
        .catch((err) => {
          console.log(err);
        })
        .then((invoices) => {
          const result = [];
          for (let i = 0; i < invoices.length; i++) {
            if (invoices[i].id == args.id){
              result.push(new Invoice(invoices[i]));
            }
          }
          return result[0];
        });
    },
  },
  Mutation: {
    createCustomer: (obj, { args }) => {
      console.log(args)
      return database
        .promise(`INSERT INTO customer (\`name\`, address, email, phone_number)
        VALUES ("${args.name}", "${args.address}", "${args.email}", "${args.phoneNumber}")`)
        .then((result) => {
          const customerId = result?.insertId;

          if (customerId) {

            return database
            .promise(`SELECT * FROM customer WHERE customer.id = ${customerId}`)
            .then((result) => {
              const data = JSON.parse(JSON.stringify(result));
              return data;
            })
            .catch((err) => {
              console.log(err);
            })
            .then(([customer]) => {
            return {
                customer: new Customer(customer),
                success: true,
              }
          });
          }
         return  {customer: null, success: false}
        })
        .catch((err) => {
          console.error(err);
        })
    },  
    createInventory: (obj, { args }) => {
      console.log(args)
      return database
        .promise(`INSERT INTO inventory (item_number, make, msrp, item_description)
        VALUES ("${args.itemNumber}", "${args.make}", ${args.msrp}, "${args.description}")`)
        .then((result) => {
          const inventoryId = result?.insertId;
          console.log(inventoryId)

          if (inventoryId) {

            return database
            .promise(`SELECT * FROM inventory WHERE inventory.id = ${inventoryId}`)
            .then((result) => {
              const data = JSON.parse(JSON.stringify(result));
              return data;
            })
            .catch((err) => {
              console.log(err);
            })
            .then(([inventory]) => {
            return {
                inventory: new Inventory(inventory),
                success: true,
              }
          });
          }
         return  {inventory: null, success: false}
        })
        .catch((err) => {
          console.error(err);
        })
    },  
    createInvoice: (obj, { args }) => {
      console.log(args)
      return database
        .promise(`INSERT INTO invoice (customer_id, date_of_sale)
        VALUES ("${args.customerId}", "${args.dateOfSale}")`)
        .then((result) => {
          const invoiceId = result?.insertId;
          console.log(invoiceId)

          if (invoiceId) {

            return database
            .promise(`SELECT * FROM invoice WHERE invoice.id = ${invoiceId}`)
            .then((result) => {
              const data = JSON.parse(JSON.stringify(result));
              return data;
            })
            .catch((err) => {
              console.log(err);
            })
            .then(([invoice]) => {
            return {
                invoice: new Invoice(invoice),
                success: true,
              }
          });
          }
         return  {invoice: null, success: false}
        })
        .catch((err) => {
          console.error(err);
        })
    },     
    createInvoiceItem: (obj, { args }) => {
      console.log(args)
      return database
        .promise(`INSERT INTO invoice_item (invoice_number, line_number, item_id, quantity, price)
        VALUES (${args.invoice}, ${args.lineNumber}, ${args.item}, ${args.quantity}, ${args.price})`)
        .then((result) => {
            return database
            .promise(`SELECT * FROM invoice_item WHERE invoice_number = ${args.invoice} and line_number = ${args.lineNumber}`)
            .then((result) => {
              const data = JSON.parse(JSON.stringify(result));
              return data;
            })
            .catch((err) => {
              console.log(err);
            })
            .then(([invoiceItem]) => {
              if(invoiceItem){
                return {
                    invoiceItem: new InvoiceItem(invoiceItem),
                    success: true,
                  }
                }
              return  {invoiceItem: null, success: false}
          });
        })
        .catch((err) => {
          console.error(err);
        })
    }, 
    deleteCustomer: async (obj, { id }) => {
      try {
        console.log("Customer ID: ", id)
        const [existingInvoiceItem] = await database.promise (`
          SELECT EXISTS (
            SELECT 1
              FROM invoice
              WHERE invoice.customer_id = ${id}
          ) AS hasInvoices;
        `);

        const hasInvoices = existingInvoiceItem?.hasInvoices
        console.log({hasInvoices});
  
        if (hasInvoices){ throw new Error("Cannot delete customer due to existing invoices") }
        await database
        .promise (`DELETE FROM customer WHERE customer.id = ${id}`)
        return true
        }
      catch(error){
        console.error(error)
        return false
      }
    },
    deleteInvoice: async (obj, { id }) => {
      try {
        console.log("Inventory ID: ", id)

        const [existingItem] = await database.promise (`
          SELECT EXISTS (
            SELECT 1
              FROM invoice_item
              WHERE invoice_item.invoice_number = ${id}
          ) AS hasInvoiceItems;
        `);

        const hasInvoiceItems = existingItem?.hasInvoiceItems
        console.log({hasInvoiceItems});

        if (hasInvoiceItems){ throw new Error("Cannot delete invoice due to existing invoices_items") }


        await database
        .promise (`DELETE FROM invoice WHERE invoice.id = ${id}`)
        return true
        }
      catch(error){
        console.error(error)
        return false
      }
    },
    deleteInventory: async (obj, { id }) => {
      try {

        console.log("Inventory ID: ", id)

        const [existingItem] = await database.promise (`
          SELECT EXISTS (
            SELECT 1
              FROM invoice_item
              WHERE invoice_item.item_id = ${id}
          ) AS hasInvoiceItems;
        `);

        const hasInvoiceItems = existingItem?.hasInvoiceItems
        console.log({hasInvoiceItems});

        if (hasInvoiceItems){ throw new Error("Cannot delete inventory due to existing invoice_items") }

        await database
        .promise (`DELETE FROM inventory WHERE inventory.id = ${id}`)
        return true
        }
      catch(error){
        console.error(error)
        return false
      }
    },

    deleteInvoiceItem: async (obj, { invoiceNumber, lineNumber }) => {
      try {
        console.log("Invoice_item: ", invoiceNumber)
        await database
        .promise (`DELETE FROM invoice_item WHERE invoice_item.invoice_number = ${invoiceNumber} and invoice_item.line_number = ${lineNumber}`)
        return true
        }
      catch(error){
        console.error(error)
        return false
      }
    },
    updateCustomer: async (obj, { args }) => {
      try {
        const existingCustomer = await getCustomer(args.id);

        if (!existingCustomer) {
          throw new Error(`No customer found with id ${args.id}`)
        }

        let name = args.name !== undefined ? args.name : existingCustomer.name;

        if (name !== null) {
          name = `"${name}"`;
        }

        let address = args.address !== undefined ? args.address : existingCustomer.address;

        if (address !== null) {
          address = `"${address}"`;
        }

        let email = args.email !== undefined ? args.email : existingCustomer.email;

        if (email !== null) {
          email = `"${email}"`;
        }

        let phoneNumber = args.phoneNumber !== undefined ? args.phoneNumber : existingCustomer.phone_number;

        if (phoneNumber !== null) {
          phoneNumber = `"${phoneNumber}"`;
        }

        await database.promise(`
          UPDATE customer
          SET
            name = ${name},
            address = ${address},
            email = ${email},
            phone_number = ${phoneNumber}
          WHERE id = ${args.id}
        `)
        
        const updatedCustomer = await getCustomer(args.id);
        
        return {
          customer: new Customer(updatedCustomer),
          success: true,
        }
        }
      catch(error){
        console.error(error)
        return {
          customer: null,
          success: false,
        }
      }
    },
    updateInventory: async (obj, { args }) => {
      try {
        const existingInventory = await getInventory(args.id);

        if (!existingInventory) {
          throw new Error(`No Inventory found with id ${args.id}`)
        }

        let itemNumber = args.itemNumber !== undefined ? args.itemNumber : existingInventory.item_number

        if (itemNumber !== null) {
          itemNumber = `"${itemNumber}"`;
        }

        let make = args.make !== undefined ? args.make : existingInventory.make;

        if (make !== null) {
          make = `"${make}"`;
        }

        let msrp = args.msrp !== undefined ? args.msrp : existingInventory.msrp;

        if (msrp !== null) {
          msrp = `"${msrp}"`;
        }

        let itemDescription = args.itemDescription !== undefined ? args.itemDescription : existingInventory.item_description;

        if (itemDescription !== null) {
          itemDescription = `"${itemDescription}"`;
        }

        await database.promise(`
          UPDATE inventory
          SET
          item_number = ${itemNumber},
          make = ${make},
          msrp = ${msrp},
          item_description = ${itemDescription}
          WHERE id = ${args.id}
        `)
        
        const updatedInventory = await getInventory(args.id);
        
        return {
          inventory: new Inventory (updatedInventory),
          success: true,
        }
        }
      catch(error){
        console.error(error)
        return {
          inventory: null,
          success: false,
        }
      }
    },
    updateInvoice: async (obj, { args }) => {
      try {
        const existingInvoiceItem = await getInvoice(args.id);

        if (!existingInvoiceItem) {
          throw new Error(`No Invoice found with id ${args.id}`)
        }

        let customerId = args.customerId !== undefined ? args.customerId : existingInvoiceItem.customer_id

        if (customerId !== null) {
          customerId = `"${customerId}"`;
        }

        let dateOfSale = args.dateOfSale !== undefined ? args.dateOfSale : existingInvoiceItem.date_of_sale

        if (dateOfSale !== null) {
          dateOfSale = `"${dateOfSale}"`;
        }

        await database.promise(`
          UPDATE invoice
          SET
          customer_id = ${customerId},
          date_of_sale = ${dateOfSale}
          WHERE id = ${args.id}
        `)
        
        const updatedInvoice = await getInvoice(args.id);
        console.log("The arguments", { args }) 
        return {
          invoice: new Invoice (updatedInvoice),
          success: true,
        }
        }
      catch(error){
        console.error(error)
        return {
          invoice: null,
          success: false,
        }
      }
    },
    updateInvoiceItem: async (obj, { args }) => {
      try {

        const existingInvoiceItem = await getInvoiceItem(args);
        // cannot update the PKs

        if (!existingInvoiceItem) {
          throw new Error(`No Invoice_Item found with id ${args.lineNumber}`)
        }

        let invoice = args.invoice !== undefined ? args.invoice : existingInvoiceItem.invoice_id

        if (invoice !== null) {
          invoice = `"${invoice}"`;
        }

        let lineNumber = args.lineNumber !== undefined ? args.lineNumber : existingInvoiceItem.line_number

        if (lineNumber !== null) {
          lineNumber = `"${lineNumber}"`;
        }

        let item = args.item !== undefined ? args.item : existingInvoiceItem.item_id

        if (item !== null) {
          item = `"${item}"`;
        }

        let quantity = args.quantity !== undefined ? args.quantity : existingInvoiceItem.quantity

        if (quantity !== null) {
          quantity = `"${quantity}"`;
        }

        let price = args.price !== undefined ? args.price : existingInvoiceItem.price

        if (price !== null) {
          price = `"${price}"`;
        }

        await database.promise(`
          UPDATE invoice_item
          SET
          invoice_number = ${invoice},
          line_number = ${lineNumber},
          item_id = ${item},
          quantity = ${quantity},
          price = ${price}
          WHERE line_number = ${args.lineNumber} AND invoice_number = ${args.lineNumber}

        `)
        
        const updateInvoiceItem = await getInvoiceItem(args);
        return {
          invoiceItem: new InvoiceItem (updateInvoiceItem),
          success: true,
        }
        }
      catch(error){
        console.error(error)
        return {
          invoiceItem: null,
          success: false,
        }
      }
    },
  }
};

async function getCustomer(id) {
  const [customer] = await database.promise(`SELECT * FROM customer WHERE customer.id = ${id};`);
  return customer;
}

async function getInventory(id) {
  const [inventory] = await database.promise(`SELECT * FROM inventory WHERE inventory.id = ${id}`);
  return inventory;
}

async function getInvoice(id) {
  const [invoice] = await database.promise(`SELECT * FROM invoice WHERE invoice.id = ${id}`);
  return invoice;
}

async function getInvoiceItem(args) {
  const [invoiceItem] = await database.promise(`SELECT * FROM invoice_item WHERE invoice_item.invoice_number = ${args.invoice} and invoice_item.line_number = ${args.lineNumber}`);
  return invoiceItem;
}

const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { dedentBlockStringValue } = require("@graphql-tools/utils");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  context: () => {
    return {
      db: database,
    };
  },

  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
