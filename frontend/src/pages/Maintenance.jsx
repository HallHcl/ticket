import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ebook.css";

function Maintenance() {
  const pages = [
    {
      title: "🧹 หน้าที่ 9: การบำรุงรักษาเพื่อความปลอดภัยและยืดอายุการใช้งาน",
      content: (
        <div style={{ textAlign: 'left' }}>
          <ol>
            <li>ทำความสะอาดเครื่องและช่องระบายอากาศ: ป้องกันความร้อนสะสม</li>
            <li>ใช้กระเป๋าหรือเคสกันกระแทก: ลดความเสียหายจากการตกหล่น</li>
            <li>หลีกเลี่ยงการใช้บนเตียงหรือพื้นผ้านุ่ม ๆ: ช่วยป้องกันการอุดตันของระบบระบายความร้อน</li>
          </ol>
        </div>
      ),
      imageSrc: "path/to/image9.png",
    }
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

    pdf.save("Maintenance.pdf");
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

export default Maintenance;
