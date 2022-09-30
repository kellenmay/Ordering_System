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
    customer(id: ID!): Customer
    invoice(id: ID!): Invoice
    inventory(id: ID!): Inventory
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
        console.log(JSON.parse(JSON.stringify(result)));
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
    return `${this._invoice_number}|${this._line_number}`;
  }
  invoice() {
    return this._invoice;
  }
  item() {
    return this._item;
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

    return database
      .promise(
        `SELECT * FROM customer WHERE customer.id = ${this._customer_id}`
      )
      .then((result) => {
        console.log(JSON.parse(JSON.stringify(result)));
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
        console.log(JSON.parse(JSON.stringify(result)));
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
          console.log(JSON.parse(JSON.stringify(result)));
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
    inventories: () => {
      return database
        .promise("SELECT * FROM inventory")
        .then((result) => {
          console.log(JSON.parse(JSON.stringify(result)));
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
          return result;
        });
    },
    invoices: () => {
      return database
        .promise("SELECT * FROM invoice")
        .then((result) => {
          console.log(JSON.parse(JSON.stringify(result)));
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
  },
};

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
