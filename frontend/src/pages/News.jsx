import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { fetchNews } from '../services/newsService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      try {
        const articles = await fetchNews('technology');
        setNews(articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    getNews();
  }, []);
  

  // ฟังก์ชันเปิด Modal และตั้งค่าข่าวที่ถูกเลือก
  const handleShowPreview = (article) => {
    setSelectedNews(article);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="news-page">
        <div className="news-header-container">
          <div className="news-header">
            <h1>ข่าวสาร IT ของบริษัท Turbo Finance</h1>
            <p>อัปเดตความเคลื่อนไหวและเทคโนโลยีในแวดวงการเงินและการสนับสนุน IT ภายในองค์กร</p>
          </div>
        </div>

        <div className="news-page-container">
          <Row>
            <Col lg={8} md={12}>
              <div className="popular-header">ข่าวสารต่างๆ</div>
              {news.length > 0 ? (
                news.slice(0, 5).map((article, index) => (
                  <Card 
                    key={article.id || index} 
                    className={index === 0 ? "news-main" : "news-item"} 
                    onClick={() => handleShowPreview(article)} 
                    style={{ cursor: "pointer" }} // ให้ Card เป็นแบบคลิกได้
                  >
                    <Card.Img variant="top" src={article.urlToImage || "https://via.placeholder.com/600x300"} />
                    <Card.Body>
                      <Card.Title>{article.title}</Card.Title>
                      <Card.Text>
                        {article.source?.name || "ไม่ระบุแหล่งที่มา"} | {new Date(article.publishedAt).toLocaleDateString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>กำลังโหลดข่าว...</p>
              )}
            </Col>

            <Col lg={4} md={12}>
              <div className="popular-header">ข่าวยอดนิยม</div>
              {news.length > 5 && news.slice(5, 10).map((article, index) => (
                <Card 
                  key={article.id || index} 
                  className="news-popular mt-3"
                  onClick={() => handleShowPreview(article)} 
                  style={{ cursor: "pointer" }} // ให้ Card เป็นแบบคลิกได้
                >
                  <Card.Img variant="top" src={article.urlToImage || "https://via.placeholder.com/600x300"} />
                  <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>
                      {article.source?.name || "ไม่ระบุแหล่งที่มา"} | {new Date(article.publishedAt).toLocaleDateString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </div>

        {/* Modal สำหรับแสดง Preview ข่าว */}
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

      </div>
    </Layout>
  );
};

export default News;
