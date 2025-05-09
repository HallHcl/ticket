import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ebook.css";

function Storage() {
  const pages = [
    {
      title: "📦 หน้าที่ 10: การเก็บรักษาโน้ตบุ๊คในระยะยาว",
      content: (
        <div style={{ textAlign: 'left' }}>
          <ol>
            <li>ชาร์จแบตเตอรี่ให้อยู่ที่ 50-60% ก่อนเก็บ: การเก็บแบตเตอรี่ที่เต็ม 100% หรือเหลือน้อยเกินไปอาจทำให้เสื่อมเร็ว</li>
            <li>หลีกเลี่ยงการเก็บในที่ร้อนหรือเย็นเกินไป: อุณหภูมิที่เหมาะสมคือ 15-25°C</li>
            <li>ใช้ซองหรือกล่องปิดสนิท: ป้องกันฝุ่นและแมลงเข้าไปในพอร์ตหรือช่องระบายอากาศ</li>
            <li>อย่าวางโน้ตบุ๊คบนพื้นโดยตรง: ควรเก็บไว้บนชั้นหรือโต๊ะที่สะอาด</li>
            <li>สำรองข้อมูลก่อนเก็บ: คัดลอกไฟล์สำคัญลง External Hard Drive หรือ Cloud</li>
            <li>อัปเดตระบบและซอฟต์แวร์ก่อนเก็บ: ป้องกันปัญหาซอฟต์แวร์ล้าสมัยเมื่อนำกลับมาใช้งาน</li>
            <li>อย่าเก็บในที่มีแม่เหล็กแรงสูง: เช่น ใกล้ลำโพงขนาดใหญ่ หรือมอเตอร์ไฟฟ้า</li>
            <li>เสียบชาร์จแบตเตอรี่ก่อนใช้งาน: หากเก็บไว้นาน อาจต้องปล่อยให้ชาร์จทิ้งไว้ 30-60 นาที</li>
            <li>อัปเดตซอฟต์แวร์และตรวจสอบไวรัส: เพื่อให้ระบบทันสมัยและปลอดภัย</li>
            <li>เก็บในแนวนอน: ป้องกันแรงกดทับที่อาจทำให้หน้าจอหรือบานพับเสียหาย</li>
          </ol>
        </div>
      ),
      imageSrc: "path/to/image10.png",
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

    pdf.save("Storage.pdf");
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

export default Storage;
