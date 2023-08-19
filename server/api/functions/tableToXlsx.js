
import * as XLSX from 'xlsx'
const today = new Date()

function tableToXlsx (jsTable, fileName) {
  // JS table to HTML table
  const table = document.createElement('table')
  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')
  const headerRow = document.createElement('tr')

  // Create table header row
  const keys = Object.keys(jsTable[0])
  for (const key of keys) {
    const headerCell = document.createElement('th')
    headerCell.textContent = key
    headerRow.appendChild(headerCell)
  }
  thead.appendChild(headerRow)
  table.appendChild(thead)
  // Create table data rows
  for (const obj of jsTable) {
    const dataRow = document.createElement('tr')
    for (const key of keys) {
      const dataCell = document.createElement('td')
      dataCell.textContent = obj[key]
      dataRow.appendChild(dataCell)
    }
    tbody.appendChild(dataRow)
  }
  table.appendChild(tbody)
  console.log('HTML', table)
  // Extract Data (create a workbook object from the table)
  const workbook = XLSX.utils.table_to_book(table)
  console.log('WORKBOOK', workbook)
  // Package and Release Data (`writeFile` tries to write and save an XLSX file)
  XLSX.writeFileXLSX(workbook, fileName + '_' + today.toISOString().slice(0, 10) + '.xlsx')
}

export default tableToXlsx
