package models

import (
	"database/sql"
)

type ConnDB struct {
	DB *sql.DB
}

func (m *ConnDB) Set(query string, data ...interface{}) error {
	// Always Prepare Query before Execution.
	// Prevents SQL injections.
	// Can improve performance.
	stmt, err := m.DB.Prepare(query)
	if err != nil {
		return err
	}

	// Execute the Statement of Prepared Query.
	if _, err := stmt.Exec(data...); err != nil {
		return err
	}

	return nil
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

func (m *ConnDB) Get(query string, pieceOfData ...interface{}) (map[string]interface{}, error) {
	// Represents a Row of Data
	data := make(map[string]interface{})

	rows, err := m.DB.Query(query, pieceOfData)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	// Get Table Header Values
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	
	// Prepare Slice to be Scan for Result
	values := make([]interface{}, len(columns))
	for i := range values {
		values[i] = new(interface{})
	}

	if err = rows.Scan(values...); err != nil {
		return nil, err
	}

	for i, col := range columns {
		// Populate Data Map
		// Asserting that it is a pointer of interface{}
		data[col] = *(values[i].(*interface{}))
	}
	
	return data, nil
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

// func (m *ConnDB) GetAll(query string, pieceOfData ...interface{}) ([]map[string]interface{}, error) {
//	...
//}