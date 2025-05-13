import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ebook.css"; // Optional: You can create a separate CSS file for styling

function Security() {
  const pages = [
    { imageSrc: "/images/47.png" },
    { imageSrc: "/images/48.png" },
    { imageSrc: "/images/49.png" },
    { imageSrc: "/images/50.png" },
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

    pdf.save("Security.pdf");
  };

  return (
    <LayoutComponent>
      <div className="ebook-container">
        <div className="content">
        <div className="controls" style={{ marginBottom: "1rem" }}>
          <button onClick={() => flipbookRef.current.pageFlip().flipPrev()}>
            ⬅ Previous
          </button>
          <button onClick={downloadPDF}>📥 Download PDF</button>
          <button onClick={() => flipbookRef.current.pageFlip().flipNext()}>
            Next ➡
          </button>
        </div>
        <HTMLFlipBook width={600} height={800} className="flipbook" ref={flipbookRef}>
          {pages.map((page, index) => (
            <div
              key={index}
              className="page"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              {page.imageSrc && (
                <img
                  src={page.imageSrc}
                  alt={`Page ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "0",
                  }}
                />
              )}
              <div
                className="page-number"
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 20,
                  fontSize: "14px",
                }}
              >
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

export default Security;
