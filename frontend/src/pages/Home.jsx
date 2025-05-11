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
import './HomeStyle.css';

const Home = () => {

  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);

  
  const navigate = useNavigate();

  const ebooks = [
    {
      title: "คู่มือการใช้โน๊ตบุ้ค",
      description: "คู่มือการใช้โน๊ตบุ้คนี้ออกแบบมาเพื่อช่วยให้คุณเข้าใจวิธีการใช้งานโน๊ตบุ้คได้อย่างดี",
      image: "https://encom.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/2/_/2_14.png",
      href: "/notebook-ebook"
    },
    {
      title: "คู่มือการใช้เครื่องปริ้น",
      description: "คู่มือการใช้เครื่องปริ้นนี้ออกแบบมาเพื่อช่วยให้คุณเข้าใจวิธีการใช้งานเครื่องปริ้นได้อย่างดี",
      image: "https://dl.bs365.uz/storage/products/13802/AYwp0ObuMgVhkDS0ih6a.jpg",
      href: "/printer-ebook"
    },
    {
      title: "คู่มือการใช้ Wifi and VPN",
      description: "คู่มือการใช้ Wifi and VPN นี้ออกแบบมาเพื่อช่วยให้คุณเข้าใจวิธีการเชื่อมต่อและใช้งาน Wifi และ VPN ได้อย่างปลอดภัย",
      image: "https://static.vecteezy.com/system/resources/previews/047/649/894/non_2x/secure-vpn-wireless-shield-vpn-wifi-icon-free-png.png",
      href: "/wifi-ebook"
    }
  ];

  // Filtered e-books based on the search query
  const filteredEbooks = ebooks.filter((ebook) =>
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
                className="d-block img-fluid mx-auto"
                src="/images/it.png"
                alt="First slide"
                style={{ width: "1980px", height: "450px" }}
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-50 img-fluid mx-auto"
                src="https://www.turbo.co.th/static-images/ntb.co.th/images/banner/webp/1719584057009-desktop.webp"
                alt="Second slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-50 img-fluid mx-auto"
                src="https://www.turbo.co.th/static-images/ntb.co.th/images/banner/webp/1719584874678-desktop.webp"
                alt="Third slide"
              />
            </Carousel.Item>
          </Carousel>
        </section>

        {/* Card Section Carousel */}
        <section id="cardSectionCarousel">
          <div className="card-content">
            <small className="text-muted mb-0">ค้นหาข้อมูลในหน้านี้:</small>
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ maxWidth: '300px' }}
              placeholder="ค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="card-header-box">
              <div className="card-header">📖 E-Book</div>
            </div>
            <div className="three-row card-detail">
              <ul className="slider-list">
                <Row>
                  {filteredEbooks.map((ebook, index) => (
                    <Col lg={4} md={6} sm={12} className="mb-4" key={index}>
                      <Card
                        style={{
                          width: '24rem',
                          height: '450px',
                          backgroundColor: '#2c3e50',
                          color: '#ffffff',
                          marginBottom: '20px',
                          borderRadius: '5px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s ease-in-out',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={ebook.image}
                          alt={ebook.title}
                          style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title>{ebook.title}</Card.Title>
                          <Card.Text>{ebook.description}</Card.Text>
                          <Button variant="primary" href={ebook.href}>
                            อ่านต่อ
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </ul>
            </div>
          </div>
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
