import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = async (title, headers, data, fileName) => {
  const doc = new jsPDF();

  try {
    // 1. Dùng link CDNJS cực kỳ ổn định (không bao giờ sập như Github)
    const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/fonts/Roboto/Roboto-Regular.ttf');
    
    if (response.ok) {
        const buffer = await response.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64Font = window.btoa(binary);

        // 2. Nhúng font vào PDF
        doc.addFileToVFS('Roboto-Regular.ttf', base64Font);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto', 'normal');
    }
  } catch (error) {
    console.error("Lỗi tải font tiếng Việt:", error);
  }

  // Vẽ Tiêu đề báo cáo
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Vẽ Bảng Dữ Liệu
  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: data,
    theme: 'grid',
    styles: { 
        font: 'Roboto', // Bắt buộc dùng font vừa tải
        fontStyle: 'normal', // 🌟 FIX LỖI CRASH: Ép toàn bộ dùng font thường
        fontSize: 10,
        textColor: [50, 50, 50]
    }, 
    headStyles: { 
        fillColor: [250, 195, 21], // Màu vàng FOTOZ
        textColor: [0, 0, 0], 
        fontStyle: 'normal' // 🌟 FIX LỖI CRASH: Không đòi tìm font in đậm nữa
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${fileName}.pdf`);
};