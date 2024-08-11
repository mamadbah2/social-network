package models

import (
	"database/sql"
)

type ConnDB struct {
	DB *sql.DB
}

type DataRow map[string]interface{}

// / The Set method is used on the database connection structure
// / to handle all entries/modification in any table of database
// / by taking a suitable query (INSERT, UPDATE, DELETE).
func (m *ConnDB) Set(query string, dataRow ...interface{}) error {
	stmt, err := m.DB.Prepare(query) // Preparing queries before execution prevents SQL injections.
	if err != nil {                  // It can also improve performance.
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(dataRow...); err != nil { // Execute the statement of prepared query.
		return err
	}

	return nil
}

//______________________________________________________________________________________________________________________________________
//

// / The Get method on the other hand is used to handle the retrieval of any number of rows of data
// / from any table in the Database, given a SELECT query as argument.
func (m *ConnDB) Get(query string, pieceOfData ...interface{}) (table []DataRow, err error) {
	rows, err := m.DB.Query(query, pieceOfData) // Retrieve all rows in the table.
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns() // Get Table Columns Headers (ex: id, id_user, email, password...)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		values := make([]interface{}, len(columns)) // Initialize a slice with interfaces pointers for each row.
		for i := range values {                     // Important to correctly populate the data row map later.
			values[i] = new(interface{}) // Should match the database table columns order.
		}
		
		if err = rows.Scan(values...); err != nil { // Scan pointers slice in the order that matches the database tables
			return nil, err
		}
		
		row := make(DataRow) // Used to store a Row of Data
		for i, col := range columns { // Populate data row map.
			row[col] = *(values[i].(*interface{})) // Asserting that it is a pointer of interface{}
		}

		table = append(table, row) // Add row to the server 'table'.
	}

	return
}
