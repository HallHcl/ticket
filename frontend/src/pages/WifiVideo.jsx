import React from "react";
import "./VideoPage.css";
import LayoutComponent from "../components/Layout";

const videoData = [
    {
        title: "การใช้งานโปรแกรม OpenVPN",
        description: "เรียนรู้วิธีการตั้งค่าและใช้งานโปรแกรม OpenVPN เพื่อเชื่อมต่อ WiFi ภายในองค์กร ( 10 นาที )",
        videos: [
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4",
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4",
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4"
        ]
    },
    {
        title: "การเชื่อมต่อ WiFi เข้าเครื่องพิมพ์และโน้ตบุ๊ก",
        description: "แนวทางการตั้งค่าและเชื่อมต่อ WiFi ระหว่างเครื่องพิมพ์และโน้ตบุ๊ก เพื่อให้สามารถใช้งานร่วมกันได้ ( 5 นาที )",
        videos: [
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4",
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4",
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4"
        ]
    },
    {
        title: "การเข้าใช้งานระบบ LOS",
        description: "แนะนำการเข้าใช้งานระบบ LOS สำหรับพนักงาน เพื่อให้สามารถเข้าถึงข้อมูลและทำงานได้ ( 5 นาที )",
        videos: [
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4",
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4",
            "pixverse2Fmedia2F2712b9f4-e05b-4359-8a66-f1afa4f79280_seed1392259252.mp4"
        ]
    }
];

const WifiVideo = () => {
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
                <h2 className="highlight">OpenVPN WiFi LOS</h2>
                <h1 className="header">และการใช้งานต่างๆ</h1>
                <p className="subtext">
                  เรียนรู้วิธีใช้ซอฟแวร์ตามหลักนโยบายบริษัท
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
