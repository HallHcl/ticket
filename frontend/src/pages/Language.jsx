import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function Language() {
  const pages = [
    { imageSrc: "/images/1.png" },
    { imageSrc: "/images/test08.png", heading: "ไปที่ช่อง Search" },
    { imageSrc: "/images/test09.png", heading: "พิมพ์คำว่า Language Setting" },
    { imageSrc: "/images/test10.png", heading: "ไปที่ Add a language แล้วเพิ่มภาษาที่ต้องการ" },
    { imageSrc: "/images/test11.png", heading: "ไปที่หัวข้อ Window display language แล้วเลือกภาษาที่ต้องการ" },
    { imageSrc: "/images/5.png" },
    { imageSrc: "/images/test08.png", heading: "ไปที่ช่อง Search" },
    { imageSrc: "/images/test09.png", heading: "พิมพ์คำว่า Language Setting" },
    { imageSrc: "/images/test10.png", heading: "ไปที่ Add a language แล้วเพิ่มภาษาที่ต้องการ" },
    { imageSrc: "/images/test12.png", heading: "กดที่หัวข้อ Typing" },
    { imageSrc: "/images/test13.png", heading: "หาหัวข้อ Advanced keyboard settings" },
    { imageSrc: "/images/test14.png", heading: "กดไปที่ Input language hot keys" },
    { imageSrc: "/images/test15.png", heading: "กดปุ่ม Change Key Sequence" },
    { imageSrc: "/images/test16.png", heading: "เลือก Grace Accent(`)และเลือก Not Assigned" },
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

    pdf.save("Language.pdf");
  };

  return (
    <LayoutComponent>
      <div className="ebook-container">
        <div className="content">
          <div className="controls" style={{ marginBottom: "1rem", display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => flipbookRef.current.pageFlip().flipPrev()}>⬅ Previous</button>
            <button onClick={downloadPDF} >📥 Download PDF</button>
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
                      backgroundColor: '#9999FF',
                      border: '2px solid #330000',
                      borderRadius: '5px',
                      padding: '15px 20px',
                      marginBottom: '10px',
                      fontFamily: "'Arial', sans-serif",
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: '1.24em',
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
                    backgroundColor: '#9999FF',
                    border: '2px soli #330000',
                    borderRadius: '5px',
                    padding: '15px 20px',
                    marginBottom: '10px',
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: '1.24em',
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
}

export default Language;