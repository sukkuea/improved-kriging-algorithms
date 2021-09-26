import React from 'react'
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ButtonExportExel = ({ onSloveChange }) => {
  return (

    <div className="wrapper-export-excel">
      <ReactHTMLTableToExcel
        id="table-calculate-node-result-button"
        className="download-table-xls-button"
        table="table-calculate-node-result"
        filename="prediction_calculate_result"
        sheet="prediction_calculate_result"
        buttonText="Download as prediction"
      />
      <ReactHTMLTableToExcel
        className="download-table-xls-button"
        table="error-table"
        filename="errorSheet"
        sheet="ErrorSheetxls"
        buttonText="Download as errors report"
      />
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="zone-table"
        filename="zone_table_sheet"
        sheet="zones_table_sheet"
        buttonText="Download data zones"
      />
      <input placeholder="ใส่ค่าความชัน %" type="number" onChange={(e) => {
        const value = e.target.value
        onSloveChange(value)
      }}></input>
    </div>
  )
}

export default ButtonExportExel