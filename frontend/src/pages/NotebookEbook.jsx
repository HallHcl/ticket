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
    { imageSrc: "/images/31.png" },
    { imageSrc: "/images/32.png" },
    { imageSrc: "/images/33.png" },
    { imageSrc: "/images/34.png" },
    { imageSrc: "/images/35.png" },
    { imageSrc: "/images/36.png" },
    { imageSrc: "/images/37.png" },
    { imageSrc: "/images/38.png" },
    { imageSrc: "/images/39.png" },
    { imageSrc: "/images/40.png" },
    { imageSrc: "/images/41.png" },
    { imageSrc: "/images/42.png" },
    { imageSrc: "/images/43.png" },
    { imageSrc: "/images/44.png" },
    { imageSrc: "/images/45.png" },
    { imageSrc: "/images/46.png" },
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
      await new Promise((r) => setTimeout(r, 200));

      const page = book.getPage(i);
      if (!page || !page.element) continue;

      const originalCanvas = await html2canvas(page.element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });

      const cropHeight = originalCanvas.height - 4;
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = originalCanvas.width;
      croppedCanvas.height = cropHeight;

      const ctx = croppedCanvas.getContext("2d");
      ctx.drawImage(
        originalCanvas,
        0,
        0,
        originalCanvas.width,
        cropHeight,
        0,
        0,
        originalCanvas.width,
        cropHeight
      );

      const imgData = croppedCanvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (cropHeight * imgWidth) / originalCanvas.width;

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