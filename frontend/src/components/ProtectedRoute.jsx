// ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userRole }) => {
    if (userRole !== 'admin') {
        // ถ้า role ไม่ใช่ admin ให้ redirect ไปที่หน้าอื่น
        return <Navigate to="/home" replace />;
    }

    return children; // ถ้า role เป็น admin ให้แสดงคอมโพเนนต์ที่ต้องการ
};

export default ProtectedRoute;
