import { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { api } from '../../../middleware/Api';
import { useParams, Link } from 'react-router-dom';
import { Unit } from '../../../types/interfaces';


const UnitsIndex = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchUnitsData(currentPage);
  }, [currentPage]);

  const fetchUnitsData = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(`/home/units/${id}?page=${page}`, 'GET');
      
      if (response && response?.data?.units && response.data.units.data) {
        setUnits(response.data.units.data);
        setTotalPages(response.data.units.last_page);
      } else {
        throw new Error('Invalid response structure');
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Units" />
      <div className="min-h-screen flex flex-col justify-between">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-md bg-white dark:bg-boxdark overflow-hidden hover:shadow-lg transition duration-200 animate-pulse"
                  style={{
                    border: '1px solid transparent',
                    borderColor: 'inherit',
                  }}
                >
                  <div className="p-4">
                    <div className="h-4 dark:bg-white bg-boxdark rounded w-3/4 mb-2"></div>
                    <div className="h-4 dark:bg-white bg-boxdark rounded w-1/2"></div>
                  </div>
                </div>
              ))
            : units.map((unit) => (
                <Link
                  key={unit.id}
                  to={`/home/house/${unit.id}`}
                  className="text-black dark:text-white"
                >
                  <div
                    className={`rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200 ${
                      unit.status === 'occupied'
                        ? 'bg-green-500'
                        : 'bg-white dark:bg-boxdark'
                    }`}
                    style={{
                      border: '1px solid transparent',
                      borderColor: 'inherit',
                    }}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">
                        {unit.unit_name}
                      </h3>
                      <p>{unit.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
        <div className="flex justify-center mt-4 sticky bottom-0 bg-white dark:bg-boxdark py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 dark:bg-[#1A222C] bg-boxdark  text-white rounded "
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 dark:bg-[#1A222C] bg-boxdark  text-white rounded "
          >
            Next
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UnitsIndex;
