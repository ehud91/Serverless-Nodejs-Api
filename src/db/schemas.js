const { serial } = require("drizzle-orm/mysql-core");
const { text, timestamp, pgTable } = require("drizzle-orm/pg-core");

const LeadTable = pgTable('leads', {
   id: serial('id').primaryKey().notNull(),
   email: text('email'),
   description: text('description').default('This is my comment'),
   create_at: timestamp('created_at').defaultNow(),
});


const LeadTable2 = pgTable('leads', {
   id: serial('id').primaryKey().notNull(),
   email: text('email'),
   description: text('description').default('This is my comment'),
   create_at: timestamp('created_at').defaultNow(),
});

module.exports.LeadTable = LeadTable;
module.exports.LeadTable = LeadTable2;

// const LeadTable = {
//     email, 
//     created_at
// }