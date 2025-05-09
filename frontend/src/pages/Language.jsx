import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ebook.css";

function Language() {
    const pages = [
        {
          title: "🈸 หน้าที่ 4: การตั้งค่าภาษา (Language Settings)",
          content: (
            <div style={{ textAlign: 'left' }}>
              <p>สำหรับคนที่ต้องการเปลี่ยนภาษา Windows</p>
              <ol>
                <li>ไปที่ช่อง Search แล้วพิมพ์ว่า Language Settings หรือไปที่ Settings → Time & Language</li>
                <li>ไปที่หัวข้อ Language แล้วหาหัวข้อที่ชื่อว่า Windows Display Language แล้วเลือกภาษาที่ต้องการ</li>
              </ol>
      
              <p>สำหรับคนที่ต้องการให้คีย์บอร์ดเปลี่ยนภาษาได้</p>
              <ol>
                <li>ไปที่ช่อง Search แล้วพิมพ์ว่า Language Settings หรือไปที่ Settings → Time & Language</li>
                <li>ไปที่หัวข้อ Language แล้วหาคำว่า Spelling, typing, & keyboard settings</li>
                <li>หาหัวข้อ Advanced keyboard settings แล้วไปที่ Input language hot keys</li>
                <li>กดปุ่ม Change Key Sequence</li>
                <li>หัวข้อ Switch Input Language ให้เลือก Grave Accent (*)</li>
                <li>หัวข้อ Switch Keyboard Layout ให้เลือก Not Assigned</li>
              </ol>
            </div>
          ),
          
        },{
            imageSrc: "https://media.canva.com/v2/image-resize/format:PNG/height:753/quality:100/uri:ifs%3A%2F%2F%2F64a9624c-d741-4d67-8ad1-f9b0afdd97dc/watermark:F/width:797?csig=AAAAAAAAAAAAAAAAAAAAAOmMwe3FnkGsqceNnqaZ5Odkb2UlJyOdD9aGPGcnC_Ct&exp=1745779488&osig=AAAAAAAAAAAAAAAAAAAAANZxNP24EpgQrzDGKCqjFvl1TAOKgZ4g6qGNyWNN8cQZ&signer=media-rpc&x-canva-quality=screen"
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

    pdf.save("Language.pdf");
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

export default Language;