import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ebook.css";

function JoinDomain() {
  const pages = [
    {
      title: "🌐 หน้าที่ 3: การเข้าร่วมโดเมน (Join Domain)",
      content: (
        <div style={{ textAlign: 'left' }}>
          <ol>
            <li>ไปที่ช่อง Search แล้วพิมพ์คำว่า "this pc" จากนั้นคลิกขวาและไปที่ Properties หรือไปที่ Settings → System → About</li>
            <li>กดไปที่หัวข้อ "Rename this PC (Advanced)"</li>
            <li>ในหัวข้อ "Computer name" ให้ใส่ชื่อ asset ของเครื่อง</li>
            <li>ในหัวข้อ "Member of" ให้เปลี่ยนจาก "Workgroup" เป็น "Domain" แล้วใส่ Domain ของบริษัทลงไป</li>
          </ol>
        </div>
      ),
      imageSrc: "",
    },
    // สามารถเพิ่มหน้าถัดไปได้ใน array นี้
  ];

  const flipbookRef = useRef();

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    if (!flipbookRef.current) {
      console.error("flipbookRef.current เป็น null หรือ undefined");
      return;
    }

    const book = flipbookRef.current.pageFlip();

    for (let i = 0; i < pages.length; i++) {
      book.turnToPage(i);
      await new Promise((r) => setTimeout(r, 100)); // รอให้หน้าโหลดเสร็จ

      const page = book.getPage(i);
      if (!page || !page.element) {
        console.error(`ไม่พบองค์ประกอบของหน้าที่ ${i + 1}`);
        continue;
      }

      const canvas = await html2canvas(page.element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    pdf.save("JoinDomain.pdf");
  };

  const turnToPageWithAnimation = (pageIndex) => {
    if (!flipbookRef.current) {
      console.error("flipbookRef.current is null");
      return;
    }

    const book = flipbookRef.current.pageFlip();
    if (book) {
      book.turnToPage(pageIndex);
    } else {
      console.error("Could not access pageFlip instance");
    }
  };

  return (
    <LayoutComponent>
      <div className="ebook-container">
        <div className="sidebar">
          <h3>สารบัญ</h3>
          <ul>
            {pages.map((page, index) => (
              <li key={index}>
                <button onClick={() => turnToPageWithAnimation(index)}>
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="content">
          <button className="download-btn" onClick={downloadPDF}>
            📥 Download PDF
          </button>
          <HTMLFlipBook width={600} height={600} className="flipbook" ref={flipbookRef}>
            {pages.map((page, index) => (
              <div key={index} className="page">
                <h2>{page.title}</h2>
                {page.content}
                {page.imageSrc && <img src={page.imageSrc} alt={`Page ${index + 1}`} />}
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </LayoutComponent>
  );
}

export default JoinDomain;
