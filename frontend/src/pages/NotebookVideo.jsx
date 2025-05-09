import React from "react";
import "./VideoPage.css";
import LayoutComponent from "../components/Layout";

const videoData = [
    {
        title: "ติดตั้ง Windows",
        description: "เรียนรู้การลงวินโดว์เบื้องต้น ( 5 นาที )",
        videos: [
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4",
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4",
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4"
        ]
    },
    {
        title: "ตั้งค่าพื้นฐาน",
        description: "จอยโดเมน, ตั้งค่าภาษา, เวลา, แอพเริ่มต้น ( 10 นาที )",
        videos: [
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4",
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4",
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4"
        ]
    },
    {
        title: "การดูแลและทำความสะอาด",
        description: "วิธีทำความสะอาดและดูแลโน้ตบุ๊คระยะยาว ( 5 นาที )",
        videos: [
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4",
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4",
            "pixverse2Fmedia2Ff9ef57d0-2222-4c05-a6a1-c05e308699b5_seed1490339874.mp4"
        ]
    }
];

const NotebookVideo = () => {
    return (
        <LayoutComponent>
            <div className="container">
                {/* แก้ไขการใช้ img ให้ถูกต้อง */}
                <img src="https://blog.cloudhm.co.th/wp-content/uploads/2020/06/Windows.png" className="background-left-1" alt="" />
                <img src="https://play-lh.googleusercontent.com/k2TxH3PQBHqBz7aKze6l-O4XwwqRb_kRGOtVTAIHUSWckYbdH431VmUQxRTEkwuMVGlC" className="background-right-1" alt="" />

                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Unofficial_Windows_logo_variant_-_2002%E2%80%932012_%28Multicolored%29.svg/544px-Unofficial_Windows_logo_variant_-_2002%E2%80%932012_%28Multicolored%29.svg.png" className="background-left-2" alt="" />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY2DV2EuxkcZUR2sQ-RASN3JSjoAGvTWxa7g&s" className="background-right-2" alt="" />
    
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1nWHy6RpEXbN6sRiyoN8POz9sLpOmSsGGUQ&s" className="background-left-3" alt="" />
                <img src="https://img.icons8.com/?size=512&id=s5NUIabJrb4C&format=png" className="background-right-3" alt="" />

                <img src="https://addin.co.th/wp-content/uploads/2023/07/notebook-lenovo-thinkpad-e14-gen5-graphite-black-02.jpg" className="background-left-4" alt="" />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSkZYehy6Im58mHyQevSZErKxO1scUYRD64Q&s" className="background-right-4" alt="" />


                <h1 className="header">วิดีโอแนะนำ</h1>
                <h2 className="highlight">การใช้งานโน้ตบุ๊ค</h2>
                <h1 className="header">และการตั้งค่าต่างๆ</h1>
                <p className="subtext">
                    เรียนรู้วิธีติดตั้ง ดูแล และใช้งานตามนโยบายของบริษัท
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

export default NotebookVideo;
