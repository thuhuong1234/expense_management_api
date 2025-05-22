const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const generateExcel = async ({
  rows = [],
  columns = [],
  sheetName = "Sheet1",
}) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: "landscape" },
    headerFooter: { oddFooter: "Page &P of &N", oddHeader: "Odd Page" },
  });
  worksheet.columns = columns;
  worksheet.addRows(rows);

  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FF000000" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF6FF00" },
    };
  });
  headerRow.commit();

  const fileName = `${sheetName}_${Date.now()}.xlsx`;
  const filePath = path.join(__dirname, `../uploads/${fileName}`);
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};

module.exports = generateExcel;
