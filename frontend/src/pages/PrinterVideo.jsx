import React from "react";
import "./VideoPage.css";
import LayoutComponent from "../components/Layout";

const videoData = [
    {
        title: "Epson",
        description: "แก้ไขปัญหาและโครงสร้างเครื่องพิมพ์ ( 10นาที )",
        videos: [
            "pixverse2Fmedia2Fc2830729-555b-4c56-ab84-e6c51aa8039b_seed9691382.mp4",
            "pixverse2Fmedia2Fc2830729-555b-4c56-ab84-e6c51aa8039b_seed9691382.mp4",
            "pixverse2Fmedia2Fc2830729-555b-4c56-ab84-e6c51aa8039b_seed9691382.mp4"
        ]
    },
    {
        title: "Brother",
        description: "แก้ไขปัญหาและโครงสร้างเครื่องพิมพ์ ( 10นาที )",
        videos: [
            "pixverse2Fmedia2Fc2830729-555b-4c56-ab84-e6c51aa8039b_seed9691382.mp4",
            "pixverse2Fmedia2Fc2830729-555b-4c56-ab84-e6c51aa8039b_seed9691382.mp4",
            "pixverse2Fmedia2Fc2830729-555b-4c56-ab84-e6c51aa8039b_seed9691382.mp4"
        ]
    },

];

const imageList = [
  { src: "/images/100.png", className: "background-left-1" },
  { src: "/images/101.png", className: "background-right-1" },
  { src: "/images/102.png", className: "background-left-2" },
  { src: "/images/103.png", className: "background-right-2" },
  { src: "/images/104.png", className: "background-left-3" },
  { src: "/images/105.png", className: "background-right-3" },
  { src: "/images/106.png", className: "background-left-4" },
  { src: "/images/107.png", className: "background-right-4" },
];




const WifiVideo = () => {
    return (
        <LayoutComponent>
            <div className="container">
                {/* แก้ไขการใช้ img ให้ถูกต้อง */}
                 <div>
                    {imageList.map((img, index) => (
                    <img key={index} src={img.src} className={img.className} alt={`image-${index}`} />
                    ))}
                </div>

                <h1 className="header">วิดีโอแนะนำ</h1>
                <h2 className="highlight">การใช้งานเครื่องพิมพ์</h2>
                <h1 className="header">และการตั้งค่าต่างๆ</h1>
                <p className="subtext">
                  เรียนรู้วิธีการแก้ไขปัญหาต่างๆและโครงสร้างเครื่องพิมพ์
                </p>
            </div>

            {videoData.map((section, index) => (
                <div key={index} className="video-section">
                    <h2 className="section-title">{section.title}</h2>
                    <p className="section-description">{section.description}</p>
                    <div className="video-grid">
                        {section.videos.map((src, idx) => (
                            <div key={idx} className="video-card">
                                <iframe 
                                    src={src} 
                                    title={`${section.title} - ${idx}`} 
                                    frameBorder="0" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </LayoutComponent>
    );
};

export default WifiVideo;
