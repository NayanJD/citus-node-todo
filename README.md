# Todo example using Postgres with Citus Distributed Tables

## Citus Installation Steps

1. Install postgres using brew

 ```
 brew install postgres
 ```
 
 2. Follow this guide [here](https://docs.citusdata.com/en/v5.1/installation/single_machine_osx.html) to install one master (coordinator) postgres node and two worker (data) nodes. The data is actually distributes between worker nodes. The master node runs the queries across nodes to get the data back. 
 
 3. After all three nodes are up, add the two worker nodes to the cluster using below:
 
 ```
 psql -p 9700 -c "select * from master_add_node('localhost', 9701);"
 psql -p 9700 -c "select * from master_add_node('localhost', 9702);"
 ```
 
 To verify if the nodes are in the cluster now:
 
 ```
 psql -p 9700 -c "select * from master_get_active_worker_nodes();"
 ```
 
 4. Run our todo migrations to create our company and todo tables. Here are our migration sql:
 
 
 ```
 CREATE TABLE company (
  id bigserial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE todo (
  id bigserial,
  content text NOT NULL,
  company_id bigint REFERENCES company (id),
  PRIMARY KEY (company_id, id)
);

SELECT create_distributed_table('company',   'id');
SELECT create_distributed_table('todo',   'company_id');
 ```

Here we are using the company_id as the partition key for our tables. The rows in both tables having same company_id would be located on the same rows by citus. Thus, reducing inter nodes communication while making a query. 

Run the migration as below (you have to be in the project root):

```
psql -p 9700 -U $(whoami)

psql (14.4)
Type "help" for help.

batman=# \i migration.sql;
batman=# \dt;
        List of relations
 Schema |  Name   | Type  | Owner
--------+---------+-------+-------
 public | company | table | batman
 public | todo    | table | batman
```

## Running the seeder

1. Npm install and run the seeder.js

```
npm i
node ./seeder.js
```

2. Verify if the data in both tables are distributed across worker nodes:

```
batman=# select nodename, nodeport, table_name, sum(shard_size) size from citus_shards group by nodename, nodeport, table_name order by nodename, nodeport;

 nodename  | nodeport | table_name |  size
-----------+----------+------------+--------
 localhost |     9701 | company    |  65536
 localhost |     9701 | todo       | 114688
 localhost |     9702 | company    |  24576
 localhost |     9702 | todo       |  32768

```
