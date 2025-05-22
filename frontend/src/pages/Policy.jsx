import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ebook.css";

function Policy() {
  const pages = [
    { imageSrc: "/images/68.png" },
    { imageSrc: "/images/test01.png", heading: "ตั้งค่าความปลอดภัยและรหัสผ่านของคุณเอง" },
    { imageSrc: "/images/test03.png", heading: "ติดตั้งซอฟต์แวร์ที่ได้รับอนุญาต" },
    { imageSrc: "/images/test02.png", heading: "เปิด VPN ทุกครั้งและนำข้อมูลเข้า Google Drive เพื่อกันข้อมูลหาย" }, // เพิ่มหัวข้อที่นี่
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
      await new Promise((r) => setTimeout(r, 100)); // Wait for the page to load

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

    pdf.save("Policy.pdf");
  };

  return (
    <LayoutComponent>
      <div className="ebook-container">
        <div className="content">
                <div className="controls" style={{ marginBottom: "1rem", display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => flipbookRef.current.pageFlip().flipPrev()}>⬅ Previous</button>
            <button onClick={downloadPDF}>📥 Download PDF</button>
            <button onClick={() => flipbookRef.current.pageFlip().flipNext()}>Next ➡</button>
          </div>
          <HTMLFlipBook width={600} height={800} className="flipbook" ref={flipbookRef}>
            {pages.map((page, index) => (
              <div
                key={index}
                className="page"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start', // เปลี่ยนเป็น flex-start เพื่อจัดหัวข้อไว้ด้านบน
                  alignItems: 'center',
                  position: "relative",
                  paddingTop: page.headings ? '20px' : '10px', // เพิ่ม padding ด้านบนถ้ามีหลายหัวข้อ
                }}
              >
                {page.headings && page.headings.map((heading, headingIndex) => (
                  <div
                    key={headingIndex}
                    style={{
                      backgroundColor: '#FFA726',
                      border: '2px solid #E64A19',
                      borderRadius: '5px',
                      padding: '15px 20px',
                      marginBottom: '10px',
                      fontFamily: "'Arial', sans-serif",
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: '1.24em',
                      display: 'inline-block',
                      textAlign: 'center',
                      width: '80%', // กำหนดความกว้างให้หัวข้อ (ปรับตามต้องการ)
                    }}
                  >
                    {heading}
                  </div>
                ))}
                {!page.headings && page.heading && (
                  <div style={{
                    backgroundColor: '#FFA726',
                    border: '2px solid #E64A19',
                    borderRadius: '5px',
                    padding: '15px 20px',
                    marginBottom: '10px',
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: '1.24em',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: '80%', // กำหนดความกว้างให้หัวข้อ (ปรับตามต้องการ)
                  }}>
                    {page.heading}
                  </div>
                )}
                {page.imageSrc && (
                  <img
                    src={page.imageSrc}
                    alt={`Page ${index + 1}`}
                    className="page-image"
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                      borderRadius: '0px',
                      marginTop: page.headings ? '10px' : '0',
                    }}
                  />
                )}
                <div className="page-number" style={{ position: "absolute", bottom: 10, right: 20, fontSize: "14px" }}>
                  📄 {index + 1}
                </div>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </LayoutComponent>
  );
}

export default Policy;