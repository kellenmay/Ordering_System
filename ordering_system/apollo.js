const { ApolloServer, gql } = require('apollo-server');
const databaseQuery = require('./database');

const typeDefs = gql`

  type Item {
    quantity: Int
    make: String
    itemId: Int
  }

  type Customer {
    id: Int
    name: String
    address: String
    email: String
    phone_number: String
  }

  type Inventory {
    id: Int
    item_id: String
    make: String
    msrp: Float
    item_description: String
  }

  type Invoice_Item {
    invoice_number: Int
    line_number: Int
    item_id: Int
    quantity: Int
    price: Float
  }

  type Invoice {
    id: Int
    customer_id: Int
    date_of_sale: Date
  }

  type Query {
    items: [Item]
  }
`;

const item = { 
  quantity: () => {
    return 9
  }, 
  make: () => {
    return {name: 'wrench'}
  }, 
  itemId: () => {
    return 17
  }
}


class Item {

  _quantity
  _make
  _item_id

  constructor(args){
    this._quantity = args.quantity
    this._make = args.make
    this._item_id = args.item_id
  }
  quantity(){
    return this._quantity
  }
  make(){
    return this._make
  }
  itemId(){
    return this._item_id
  }
}


const resolvers = {
    Query: {
      items: () => {
        return databaseQuery.then((items) => {
          
          const result = []

          for( let i = 0; i < items.length; i++ ){

           result.push(new Item(items[i]))
          }

          return result

        })

      }
    },
};



setTimeout(function () {
    console.log(resolvers)
  }, 2000);


  const {
    ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');
const { dedentBlockStringValue } = require('@graphql-tools/utils');
  
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    /**
     * What's up with this embed: true option?
     * These are our recommended settings for using AS;
     * they aren't the defaults in AS3 for backwards-compatibility reasons but
     * will be the defaults in AS4. For production environments, use
     * ApolloServerPluginLandingPageProductionDefault instead.
    **/
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],

});
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });