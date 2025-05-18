import { useNavigate } from "react-router-dom";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdLanguage, MdAccessTime, MdPolicy, MdSecurity, MdStorage } from "react-icons/md";
import { FaWindows, FaTools, FaPrint } from "react-icons/fa";
import { GiArchiveRegister } from "react-icons/gi";
import { BsBoxSeam } from "react-icons/bs";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EbookSimpleList.css";

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}


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
    case "Maintenance":
      return <FaTools />;
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

const EbookSimpleList = ({ ebooks }) => {
  const navigate = useNavigate();
    const chunked = chunkArray(ebooks, 4); // แบ่งกลุ่มละ 4


 return (
    <div className="w-full py-8  rounded-lg shadow-md">
      <Carousel fade interval={2500} controls={true} indicators={true}>
        {chunked.map((group, idx) => (
<Carousel.Item key={idx} style={{ minHeight: 350 }}>
 <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 48,
                width: "100%",
                overflow: "hidden",
                position: "relative", // เพิ่มเพื่อช่วยแก้ปัญหาซ้อน
              }}
            >    
       {group.map((ebook) => (
                <div
                  key={ebook.id}
                  className="ebook-simple-item cursor-pointer"
                  style={{ maxWidth: 320, flex: "1 1 0" }}
                  onClick={() => navigate(ebook.path)}
                >
                  <div className="ebook-simple-oval shadow-lg" style={{ margin: "0 auto 16px auto" }}>
                    <span className="ebook-simple-icon">
                      {getCategoryIcon(ebook.category)}
                    </span>
                  </div>
                  <div className="ebook-simple-bottom" style={{ textAlign: "center" }}>
                    <div className="ebook-simple-title">{ebook.title}</div>
                    <div className="ebook-simple-desc">{ebook.description}</div>
                    <button
                      className="see-more-btn"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(ebook.path);
                      }}
                      style={{
                        marginTop: 12,
                        background: "#16335B",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "6px 18px",
                        cursor: "pointer"
                      }}
                    >
                      อ่านต่อ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default EbookSimpleList;