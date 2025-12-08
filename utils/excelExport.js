const ExcelJS = require('exceljs');

/**
 * Export attendance data to Excel format
 * @param {Array} attendanceData - Array of attendance records
 * @param {string} className - Name of the class
 * @returns {Promise<Buffer>} Excel file buffer
 */
async function exportToExcel(attendanceData, className) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Digital Attendance System';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Attendance Records');

    // Define columns
    worksheet.columns = [
        { header: 'SL', key: 'sl', width: 8 },
        { header: 'Registration Number', key: 'registrationNumber', width: 25 },
        { header: 'Name', key: 'studentName', width: 30 },
        { header: 'Timestamp', key: 'timestamp', width: 25 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 25;

    // Sort by registration number
    const sortedData = [...attendanceData].sort((a, b) =>
        a.registrationNumber.localeCompare(b.registrationNumber)
    );

    // Add data rows
    sortedData.forEach((record, index) => {
        worksheet.addRow({
            sl: index + 1,
            registrationNumber: record.registrationNumber,
            studentName: record.studentName,
            timestamp: new Date(record.timestamp).toLocaleString('en-US', {
                timeZone: 'Asia/Dhaka',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        });
    });

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        // Alternate row colors for better readability (skip header)
        if (rowNumber > 1 && rowNumber % 2 === 0) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE9EFF7' }
            };
        }
    });

    // Add title row at the top
    worksheet.insertRow(1, []);
    worksheet.insertRow(1, [`Attendance Report - ${className}`]);
    worksheet.insertRow(2, [`Generated: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}`]);
    worksheet.insertRow(3, [`Total Students: ${sortedData.length}`]);
    worksheet.insertRow(4, []);

    // Style title
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A2').font = { italic: true, size: 11, color: { argb: 'FF666666' } };
    worksheet.getCell('A3').font = { bold: true, size: 11 };

    // Merge title cells
    worksheet.mergeCells('A1:D1');
    worksheet.mergeCells('A2:D2');
    worksheet.mergeCells('A3:D3');

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

module.exports = {
    exportToExcel
};
