import * as mongoose from 'mongoose';
import MongoDBInterface from '@accounts/mongo';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { DatabaseManager } from '@accounts/database-manager';
import { createAccountsGraphQL, accountsContext } from '@accounts/graphql-api';

const start = async () => {
  // Create database connection
  let storage;
  if (process.env.ACCOUNTS_DB === 'mongo') {
    await mongoose.connect(process.env.ACCOUNTS_DB_URL, { useNewUrlParser: true });
    storage = new MongoDBInterface(mongoose.connection);
  }

  // Build a storage for storing users
  // Create database manager (create user, find users, sessions etc) for accounts-js
  const accountsDb = new DatabaseManager({
    sessionStorage: storage,
    userStorage: storage,
  });

  // Create accounts server that holds a lower level of all accounts operations
  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: process.env.ACCOUNTS_SECRET },
    { password: new AccountsPassword() },
  );

  // Creates resolvers, type definitions, and schema directives used by accounts-js
  const accountsGraphQL = createAccountsGraphQL(accountsServer, { extend: false });

  const schema = makeExecutableSchema({
    resolvers: { Query: {}, ...accountsGraphQL.resolvers },
    schemaDirectives: accountsGraphQL.schemaDirectives,
    typeDefs: [accountsGraphQL.typeDefs],
  });

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema,
    context: ({ req }) => accountsContext(req, { accountsServer }),
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

start();
