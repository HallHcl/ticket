import React from "react";
import HTMLFlipBook from "react-pageflip";
import LayoutComponent from "../components/Layout";
import "./Ebook.css";

const pages = [
  {
    isCover: true,
    title: "📘 คู่มือการใช้งานเครื่องพิมพ์",
    content: (
      <div style={{ textAlign: "center", marginTop: "40%" }}>
        <h1>คู่มือการใช้งานเครื่องพิมพ์</h1>
        <p>สำหรับเครื่อง Epson และ Brother</p>
        <p>Turbo Finance Co., Ltd.</p>
      </div>
    ),
  },
  {
    title: "💾 หน้าที่ 1: คุณสมบัติ Epson M3170",
    content: (
      <>
        <h3>ข้อดี</h3>
        <ol>
          <li>ประหยัดหมึกและต้นทุนการพิมพ์</li>
          <li>ความเร็วการพิมพ์สูง</li>
          <li>ฟังก์ชันครบครัน (4in1)</li>
          <li>รองรับการพิมพ์สองหน้าอัตโนมัติ</li>
          <li>รองรับการเชื่อมต่อแบบไร้สาย</li>
          <li>คุณภาพงานพิมพ์สูง</li>
          <li>ถังหมึกคุณภาพสูง เติมง่าย ไม่หกเลอะเทอะ</li>
          <li>ประหยัดพลังงานกว่าระบบเลเซอร์</li>
        </ol>
        <h3>ข้อเสีย</h3>
        <ol>
          <li>ราคาสูงกว่าระบบเลเซอร์ขาวดำบางรุ่น</li>
          <li>พิมพ์ได้แค่ขาว-ดำ ไม่รองรับสี</li>
          <li>ความเร็วในการพิมพ์อาจช้ากว่าเลเซอร์</li>
          <li>ถ้าพิมพ์ไม่บ่อย หมึกอาจแห้ง</li>
          <li>ขนาดใหญ่และหนัก</li>
          <li>ต้นทุนอะไหล่และค่าซ่อมสูง</li>
        </ol>
      </>
    ),
  },
  {
    title: "⚙️ หน้าที่ 7: การเชื่อมต่อ Brother MFC-L2700D กับโน้ตบุ๊ค",
    content: (
      <ol>
        <li>เชื่อมต่อสาย USB กับโน้ตบุ๊ค</li>
        <li>เปิดทั้งเครื่องพิมพ์และโน้ตบุ๊ค</li>
        <li>ดาวน์โหลดไดรเวอร์จากเว็บ Brother</li>
        <li>ติดตั้งตามขั้นตอน</li>
        <li>ระบบจะตรวจเจอเครื่องพิมพ์อัตโนมัติ</li>
        <li>ทดลองพิมพ์เพื่อยืนยัน</li>
      </ol>
    ),
    imageSrc: "path/to/image7.png",
  },
  {
    title: "🛡️ หน้าที่ 8: การแก้ปัญหา Brother MFC-L2700D",
    content: (
      <>
        <h4>ไม่เชื่อมกับคอม</h4>
        <ol>
          <li>ตรวจสอบสาย USB</li>
          <li>รีสตาร์ททั้งเครื่องพิมพ์และคอม</li>
          <li>ติดตั้งไดรเวอร์ใหม่</li>
        </ol>
        <h4>สแกน/ถ่ายเอกสารไม่ได้</h4>
        <ol>
          <li>ตรวจสอบการเชื่อมต่อ</li>
          <li>ตรวจสอบซอฟต์แวร์สแกน</li>
        </ol>
      </>
    ),
    imageSrc: "path/to/image8.png",
  },
  {
    title: "🛡️ หน้าที่ 8: การแก้ปัญหา Brother MFC-L2700D",
    content: (
      <>
        <h4>ไม่เชื่อมกับคอม</h4>
        <ol>
          <li>ตรวจสอบสาย USB</li>
          <li>รีสตาร์ททั้งเครื่องพิมพ์และคอม</li>
          <li>ติดตั้งไดรเวอร์ใหม่</li>
        </ol>
        <h4>สแกน/ถ่ายเอกสารไม่ได้</h4>
        <ol>
          <li>ตรวจสอบการเชื่อมต่อ</li>
          <li>ตรวจสอบซอฟต์แวร์สแกน</li>
        </ol>
      </>
    ),
    imageSrc: "path/to/image8.png",
  },
  {
    isBackCover: true,
    title: "📙 ปกหลัง",
    content: (
      <div style={{ textAlign: "center", marginTop: "40%" }}>
        <h2>จบเล่ม</h2>
        <p>ขอบคุณที่อ่านคู่มือ</p>
        <p>Turbo Finance Co., Ltd.</p>
      </div>
    ),
  },
];

const PrinterEbook = () => {
  return (
    <LayoutComponent>
      <div className="ebook-container">
        <HTMLFlipBook
          width={600}
          height={800}
          showCover={true} 
          mobileScrollSupport={true}
          className="flip-book"
        >
          {pages.map((page, index) => (
            <div
              key={index}
              className={`page ${page.isCover ? "cover-page" : ""}`}
            >
              <h2>{page.title}</h2>
              {page.imageSrc && (
                <img
                  src={page.imageSrc}
                  alt={`page-${index}`}
                  className="page-image"
                />
              )}
              <div className="page-content">{page.content}</div>
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </LayoutComponent>
  );
};

export default PrinterEbook;
