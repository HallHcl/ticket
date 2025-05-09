import { Link } from 'react-router-dom';

const PrinterPage = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-semibold mb-4">Choose Your E-book</h1>
      <div className="space-x-4">
        <Link to="/epson-ebook">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Epson E-book</button>
        </Link>
        <Link to="/brother-ebook">
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700">Brother E-book</button>
        </Link>
      </div>
    </div>
  );
};

export default PrinterPage;
