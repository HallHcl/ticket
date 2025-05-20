import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNews } from '../services/newsService';
import Layout from '../components/Layout';
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';   
import EbookSimpleList from '../components/EbookSimpleList'; // เพิ่มบรรทัดนี้
import './HomeStyle.css';

const Home = () => {

  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, ] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);

  
  const navigate = useNavigate();

  const ebooksAll = [
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
    path: "/language",
  },
  {
    id: 3,
    title: "Time Settings",
    description: "การตั้งค่าเวลาและการซิงค์เวลา",
    category: "Time",
    path: "/time",
  },
  {
    id: 4,
    title: "Initial Setup",
    description: "ขั้นตอนการตั้งค่าเริ่มต้น",
    category: "Initial",
    path: "/initial",
  },
  {
    id: 5,
    title: "Policy Management",
    description: "การจัดการนโยบาย",
    category: "Policy",
    path: "/policy",
  },
  {
    id: 6,
    title: "Security Settings",
    description: "การตั้งค่าความปลอดภัย",
    category: "Security",
    path: "/security",
  },
  {
    id: 7,
    title: "Maintenance Guide",
    description: "คู่มือการบำรุงรักษา",
    category: "Maintenance",
    path: "/maintenance",
  },
  {
    id: 8,
    title: "Storage Management",
    description: "การจัดการพื้นที่จัดเก็บข้อมูล",
    category: "Storage",
    path: "/storage",
  },
  {
    id: 9,
    title: "Install Windows",
    description: "ทิปและเทคนิคสำหรับ Windows",
    category: "Windows",
    path: "/notebook-ebook",
  },
  {
    id: 10,
    title: "Brother Printer",
    description: "คู่มือการใช้งานเครื่องพิมพ์ Brother",
    category: "Brother",
    path: "/brother-ebook",
  },
  {
    id: 11,
    title: "Epson Printer",
    description: "คู่มือการใช้งานเครื่องพิมพ์ Epson",
    category: "Epson",
    path: "/epson-ebook",
  },
];

  // Filtered e-books based on the search query
  const filteredEbooks = ebooksAll.filter((ebook) =>
  ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  ebook.description.toLowerCase().includes(searchQuery.toLowerCase())
);

  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        const articles = await fetchNews('technology'); 
        setAnnouncements(articles.slice(0, 3)); 
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    getAnnouncements();
  }, []);

  const handleShowPreview = (article) => {
    setSelectedNews(article);
    setShowModal(true);
  };

  const handleNavigateToNews = () => {
    navigate('/news');
  };

  return (
    <div>
      <Layout />
      <main className="main-content">

        {/* Carousel Section */}
        <section className="carousel-section container-fluid p-0">
          <Carousel fade>
          <Carousel.Item>
            <img
              className="d-block img-fluid mx-auto carousel-banner-img"
              src="/images/a.png"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block img-fluid mx-auto carousel-banner-img"
              src="/images/b.png"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block img-fluid mx-auto carousel-banner-img"
              src="/images/c.png"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
        </section>

        {/* Card Section Carousel */}
        <section id="cardSectionCarousel" className="content-section">
          <div className="card-content">
          
            <div className="card-header-box">
              <div className="card-header">📖 E-Book</div>
            </div>
            {/* ใช้ EbookSimpleList แทนโค้ดเดิม */}
        <EbookSimpleList ebooks={filteredEbooks} searchQuery={searchQuery} />  </div>
        </section>

        {/* IT Announcements Section */}
        <section id="cardSectionCarousel">
          <div className="card-content">
            <div className="card-header-box">
              <div className="card-header">📢 IT Announcement</div>
            </div>
            <Row style={{ marginBottom: '8px' }}>
            {announcements.length > 0 ? (
              announcements.map((article, index) => (
                <Col xs={6} sm={4} md={3} lg={3} key={article.id || index} className="d-flex">
                  <Card
                    className="news-popular mt-3 w-100 d-flex flex-column"
                    onClick={() => handleShowPreview(article)}
                    style={{
                      backgroundColor: '#2c3e50',
                      color: '#fff',
                      borderRadius: '5px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      marginBottom: '0', // ลดช่องว่างล่างของ card
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={article.urlToImage || 'https://via.placeholder.com/600x300'}
                      style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column" style={{ flex: 1 }}>
                      <Card.Title style={{ fontSize: '1.1rem', minHeight: '60px' }}>{article.title}</Card.Title>
                      <div style={{ flex: 1 }} />
                      <Card.Text style={{ marginTop: 'auto', fontSize: '0.95rem', color: '#e0e0e0' }}>
                        {article.source?.name || 'ไม่ระบุแหล่งที่มา'} |{' '}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>กำลังโหลดประกาศ...</p>
            )}
          </Row>

            {/* Modal for News Preview */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>{selectedNews?.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={selectedNews?.urlToImage || "https://via.placeholder.com/600x300"}
                  alt="news-preview"
                  className="img-fluid mb-3"
                />
                <p><strong>แหล่งที่มา:</strong> {selectedNews?.source?.name || "ไม่ระบุ"}</p>
                <p>{selectedNews?.description || "ไม่มีข้อมูลสรุปข่าว"}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>ปิด</Button>
                <Button variant="primary" href={selectedNews?.url} target="_blank">อ่านต่อ</Button>
              </Modal.Footer>
            </Modal>

            <div style={{ textAlign: 'left' }}>
              <button
                onClick={handleNavigateToNews}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#ff69b4', // Pink background color
                  color: 'white', // White text color
                  border: 'none', // No border
                  borderRadius: '5px', // Optional: adds rounded corners
                  cursor: 'pointer', // Changes cursor to pointer on hover
                }}
              >
                อ่านข่าวสารเพิ่มเติม
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer id="desktopFooter">
        <div className="des-footer">

          {/* Left Column */}
          <div className="des-footer-col">
            <label id="label-product" htmlFor="menuToggleProduct">
              ผลิตภัณฑ์ <i className="icon-sl-arrowdown"></i><i className="icon-sl-arrowup"></i>
            </label>
            <div id="menuProduct" className="menu">
              <div>
                <p><a href="https://www.turbo.co.th/loans/motorcycle" className="footer-link">สินเชื่อมอเตอร์ไซค์</a></p>
                <p><a href="https://www.turbo.co.th/loans/car" className="footer-link">สินเชื่อรถยนต์</a></p>
                <p><a href="https://www.turbo.co.th/loans/tractor" className="footer-link">สินเชื่อรถแทรกเตอร์</a></p>
                <p><a href="https://www.turbo.co.th/loans/land" className="footer-link">สินเชื่อโฉนดที่ดิน</a></p>
                <p><a href="https://www.turbo.co.th/loans/nanofinance" className="footer-link">สินเชื่อนาโนไฟแนนซ์</a></p>
                <p><a href="https://www.turbo.co.th/insurances/car" className="footer-link">ประกันรถยนต์</a></p>
                <p><a href="https://www.turbo.co.th/insurances/motorcycle" className="footer-link">ประกันรถมอเตอร์ไซค์</a></p>
              </div>
              <div>
                <p><a href="http://drive.ntb.co.th/documents/penalty-and-service-fee.pdf" target="_blank" rel="noopener noreferrer" className="footer-link">ประกาศดอกเบี้ยและค่าธรรมเนียม</a></p>
                <p><a href="http://drive.ntb.co.th/documents/penalty-and-service-fee.pdf" className="footer-link">การเปิดเผยข้อมูล</a></p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="des-footer-col">
            <label htmlFor="menuToggleContacus">
              ติดต่อเรา <i className="icon-sl-arrowdown"></i><i className="icon-sl-arrowup"></i>
            </label>
            <div id="menuProduct" className="menu">
              <p>สำนักงานใหญ่</p>
              <p>บริษัท เงินเทอร์โบ จำกัด (มหาชน)</p>
              <p>500 หมู่ 3 ถนนติวานนท์ ตำบลบ้านใหม่ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120</p>
              <p>โทร : <a className="footer-tel" href="tel:028578888">📞02-857-8888</a></p>
              <p>
                <a href="https://www.facebook.com/ngernturbo/" target="_blank" rel="noopener noreferrer" className="footer-social">
                  <i className="icon-sl-facebook"></i>
                </a>
                <a href="https://line.me/R/ti/p/@ngernturbo" target="_blank" rel="noopener noreferrer" className="footer-social">
                  <i className="icon-sl-line"></i>
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="des-footer-last">
          <div className="des-footer-last-row">
            <div className="policy-list">
              <ul>
                <li><a href="http://drive.ntb.co.th/documents/penalty-and-service-fee.pdf">นโยบายเกี่ยวกับคุกกี้ (Cookie)</a></li>
                <li><a href="http://drive.ntb.co.th/documents/penalty-and-service-fee.pdf">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</a></li>
                <li><a href="http://drive.ntb.co.th/documents/penalty-and-service-fee.pdf">คำชี้แจงเกี่ยวกับการใช้กล้องวงจรปิด</a></li>
              </ul>
            </div>
            <div className="des-footer-last-col">สงวนลิขสิทธิ์ พ.ศ. 2561 บริษัท เงินเทอร์โบ จำกัด (มหาชน)</div>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default Home;