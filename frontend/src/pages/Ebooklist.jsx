import React, { useState } from "react";
import "./Ebooklist.css";
import LayoutComponent from "../components/Layout";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdLanguage, MdAccessTime, MdPolicy, MdSecurity, MdStorage} from "react-icons/md";
import { FaWindows,FaPrint } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { GiArchiveRegister } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const categories = [
  "JoinDomain",
  "Language",
  "Time",
  "Initial",
  "Policy",
  "Security",
  "Storage",
  "Windows",
  "Brother",
  "Epson",
];

// ฟังก์ชันเลือก icon ตาม category
const getCategoryIcon = (cat) => {
  switch (cat) {
    case "JoinDomain":
      return <AiOutlineUsergroupAdd />;
    case "Language":
      return <MdLanguage />;
    case "Time":
      return <MdAccessTime />;
    case "Initial":
      return <GiArchiveRegister />;
    case "Policy":
      return <MdPolicy />;
    case "Security":
      return <MdSecurity />;

    case "Storage":
      return <MdStorage />;
    case "Windows":
      return <FaWindows />;
    case "Brother":
      return <FaPrint />;
    case "Epson":
      return <FaPrint />;
    default:
      return <BsBoxSeam />;
  }
};

const ebooks = [
  {
    id: 1,
    title: "Join Domain",
    description: "วิธีการ Join Domain",
    category: "JoinDomain",
    path: "/Domain", 

  },
  {
    id: 2,
    title: "Language Settings",
    description: "การตั้งค่าภาษาใน",
    category: "Language",
    path: "/language", // เพิ่ม path ที่นี่
  },
  {
    id: 3,
    title: "Time Settings",
    description: "การตั้งค่าเวลาและการซิงค์เวลา",
    category: "Time",
    path: "/time", // เพิ่ม path ที่นี่
  },
  {
    id: 4,
    title: "Initial Setup",
    description: "ขั้นตอนการตั้งค่าเริ่มต้น",
    category: "Initial",
    path: "/initial", // เพิ่ม path ที่นี่
  },
  {
    id: 5,
    title: "Policy Management",
    description: "การจัดการนโยบาย",
    category: "Policy",
    path: "/policy", // เพิ่ม path ที่นี่
  },
  {
    id: 6,
    title: "Security Settings",
    description: "การตั้งค่าความปลอดภัย",
    category: "Security",
    path: "/security", // เพิ่ม path ที่นี่
  },
  {
    id: 7,
    title: "Storage Management",
    description: "การจัดการพื้นที่จัดเก็บข้อมูล",
    category: "Storage",
    path: "/storage", // เพิ่ม path ที่นี่
  },
  {
    id: 8,
    title: "Install Windows",
    description: "การลง Windows เบื้องต้น",
    category: "Windows",
    path: "/notebook-ebook", // เพิ่ม path ที่นี่
  },
  {
    id: 9,
    title: "Brother Printer",
    description: "คู่มือการใช้งานเครื่องพิมพ์ Brother",
    category: "Brother",
    path: "/brother-ebook", // เพิ่ม path ที่นี่
  },
  {
    id: 10,
    title: "Epson Printer",
    description: "คู่มือการใช้งานเครื่องพิมพ์ Epson",
    category: "Epson",
    path: "/epson-ebook", // เพิ่ม path ที่นี่
  },
];

const EbookAll = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // เพิ่ม state
  const navigate = useNavigate(); // เพิ่มบรรทัดนี้

  const filteredEbooks = ebooks.filter(
    (ebook) =>
      (selectedCategory === "" || ebook.category === selectedCategory) &&
      (ebook.title.toLowerCase().includes(search.toLowerCase()) ||
        ebook.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
   <LayoutComponent>
      <div className="ebooklist-container">
        <div className="ebook-header-row">
          <h1 className="ebook-header">E-book</h1>
          <input
            type="text"
            placeholder="ค้นหา E-book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ebook-search"
          />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <ul className="category-list">
            <li
  className={`category-item${selectedCategory === "" ? " active" : ""}`}
  onClick={() => setSelectedCategory("")}
  style={{ cursor: "pointer" }}
>
  <span className="category-icon" style={{ fontSize: "1.5rem" }}>
    <BsBoxSeam />
  </span>
  <span className="category-label">All</span>
</li>
            {categories.map((cat) => (
              <li
                key={cat}
                className={`category-item${selectedCategory === cat ? " active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ cursor: "pointer" }}
              >
                <span className="category-icon" style={{ fontSize: "1.5rem" }}>
                  {getCategoryIcon(cat)}
                </span>
                <span className="category-label">{cat}</span>
              </li>
            ))}
          </ul>
        </div>
        <h2 className="ebook-section-title">All E-book</h2>
        <div className="ebook-simple-list">
          {filteredEbooks.map((ebook) => (
            <div
          key={ebook.id}
          className="ebook-simple-item"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(ebook.path)} // เพิ่ม onClick
        >
              <div className="ebook-simple-oval">
                <span className="ebook-simple-icon">{getCategoryIcon(ebook.category)}</span>
              </div>
              <div className="ebook-simple-bottom">
                <div className="ebook-simple-title">{ebook.title}</div>
                <div className="ebook-simple-desc">{ebook.description}</div>
              </div>
            </div>
          ))}
          {filteredEbooks.length === 0 && <p>ไม่พบ E-book ที่ค้นหา</p>}
        </div>
      </div>
    </LayoutComponent>
  );
};

export default EbookAll;