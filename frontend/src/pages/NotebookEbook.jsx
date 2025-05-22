import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ebook.css";

const NotebookEbook = () => {
  const flipbookRef = useRef();

  const pages = [
    { imageSrc: "/images/30.png" },
    { imageSrc: "/images/test50.png", heading: "เสียบ Flash Drive Window เข้ากับ Notebook" },
    { imageSrc: "/images/test51.png", heading: "Restart เครื่อง" },
    { imageSrc: "/images/test52.png", heading: "ระหว่างที่ Restart ให้กดปุ่ม F10 ย้ำๆ" },
    { imageSrc: "/images/test53.png", heading: "เลือกเมนู Boot Option และเลือก UEFI แล้วก็ชื่อ Flash Drive" },
    { imageSrc: "/images/test54.png" },
    { imageSrc: "/images/test55.png", heading: "Window Setup ให้เลือกภาษาอังกฤษ" },
    { imageSrc: "/images/test56.png", heading: "หน้า Activate Windows ให้เลือก I don't have a product key" },
    { imageSrc: "/images/test57.png", heading: "เลือก Version Windows ให้เป็น Windows 11 Pro" },
    { imageSrc: "/images/test58.png", heading: "การแบ่ง Partition : ลบทั้งหมดให้เหลือ Drive เดียว" },
    { imageSrc: "/images/test59.png" },
    { imageSrc: "/images/test60.png", heading: "หัวข้อ Region: Thailand" },
    { imageSrc: "/images/test61.png", heading: "หัวข้อ Keyboard layout : US (และกด Add layout ด้วย)" },
    { imageSrc: "/images/test62.png", heading: "หัวข้อ Second keyboard layout : Thai" },
    { imageSrc: "/images/test63.png", heading: "เลือกเป็น Thai Kedmanee" },
    { imageSrc: "/images/test64.png", heading: "Name your PC: ใส่ชื่อจริงจุดนามสกุลสามตัว เช่น Cheewin.chu" },
    { imageSrc: "/images/test65.png", heading: "หัวข้อ Privacy: ติ๊กทุกหัวข้อ" },
  ];

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    if (!flipbookRef.current) {
      console.error("flipbookRef.current is null or undefined");
      return;
    }

    const book = flipbookRef.current.pageFlip();

    for (let i = 0; i < pages.length; i++) {
      book.turnToPage(i);
      await new Promise((r) => setTimeout(r, 200)); // Wait for the page to load

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

    pdf.save("Notebook_Manual.pdf");
  };

  return (
    <LayoutComponent>
      <div className="ebook-container">
        <div className="content">
          <div className="controls" style={{ marginBottom: "1rem" }}>
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
                  display: "flex",
                  flexDirection: "column", // Arrange items vertically
                  justifyContent: "flex-start", // Align content to the top
                  alignItems: "center",
                  position: "relative",
                  paddingTop: page.headings || page.heading ? '20px' : '10px', // Add top padding if there are headings
                }}
              >
                {/* Render multiple headings if 'headings' array exists */}
                {page.headings && page.headings.map((heading, headingIndex) => (
                  <div
                    key={headingIndex}
                    style={{
                      backgroundColor: '#6495ED',
                      border: '2px solid #0000CD',
                      borderRadius: '5px',
                      padding: '15px 20px',
                      marginBottom: '10px',
                      fontFamily: "'Arial', sans-serif",
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: '1.2em',
                      display: 'inline-block',
                      textAlign: 'center',
                      width: '80%', // Adjust width as needed
                    }}
                  >
                    {heading}
                  </div>
                ))}
                {/* Render single heading if 'heading' string exists and 'headings' array does not */}
                {!page.headings && page.heading && (
                  <div style={{
                    backgroundColor: '#6495ED',
                    border: '2px solid #0000CD',
                    borderRadius: '5px',
                    padding: '15px 20px',
                    marginBottom: '10px',
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: '1.2em',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: '80%', // Adjust width as needed
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
                      width: '90%', // Adjust width as needed
                      height: 'auto', // Allow height to adjust proportionally
                      maxHeight: page.headings || page.heading ? 'calc(100% - 60px)' : '100%', // Adjust max height based on headings
                      objectFit: 'contain',
                      borderRadius: '0px',
                      marginTop: page.headings || page.heading ? '10px' : '0', // Add margin if there are headings
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
};

export default NotebookEbook;