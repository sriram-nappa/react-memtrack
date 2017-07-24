CONTEXT
=======

Constant usage means that memory leaks are serious issues, and this tool helps to track them down.

Visualizations to help find memory leaks in a system.

RESOURCES
=========

## Postgres Database

The schema for the database is:

```sql
CREATE TABLE reports (
    id SERIAL,
    timestamp integer NOT NULL,
    bytes_used integer NOT NULL,
    current_page varchar(255) NOT NULL,
    did_aww_snap boolean NOT NULL
);

CREATE INDEX reports_timestamp_index ON reports
    USING btree (timestamp);

CREATE INDEX reports_bytes_used_index ON reports
    USING btree (bytes_used);

CREATE INDEX reports_current_page_index ON reports
    USING btree (current_page);

CREATE INDEX reports_did_aww_snap_index ON reports
    USING btree (did_aww_snap);
```

## JSON

We've also put the sample data into a JSON file. The file contains an array with 20,000 objects, each one with 4 keys (`timestamp`, `bytes_used`, `current_page`, `did_aww_snap`).
