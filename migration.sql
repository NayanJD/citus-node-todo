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