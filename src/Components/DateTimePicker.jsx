import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker=({data}) =>{

    return (
        <div>
        <table>
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.column1}</td>
                <td>{item.column2}</td>
                {/* Render other columns */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default DateTimePicker