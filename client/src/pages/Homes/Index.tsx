import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../middleware/Api';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FaBed, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import SearchBar from '../../components/Search/SearchBar';
import NewHome from './HomeSubs/NewHomeSK';
import HomeSkeleton from '../../components/Skeleton/HomeSkeleton';

interface Home {
  id: string;
  units_count: number;
  status?: string;
  name?: string;
  location?: string;
  company?: [];
  images?: string;
  houseCategory: string;
  slug?: string;
  coverPhoto:string;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Index: React.FC = () => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [filteredHomes, setFilteredHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchHomeData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(`/home`, 'GET');

      if (response && response.data.allHouses) {
        setHomes(response.data.allHouses.data);
        setFilteredHomes(response.data.allHouses.data);
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

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleSearch = (query: string) => {
    if (query.length >= 3) {
      const filtered = homes.filter(
        (home) => home.name?.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredHomes(filtered);
      if (filtered.length === 0) {
        setSearchError('No records found for the searched query');
      } else {
        setSearchError(null);
      }
    } else {
      setFilteredHomes(homes);
      setSearchError(null);
    }
  };

  const handleManageClick = (id?: string) => {
    if (id) {
      navigate(`/home/${id}`);
    } else {
      console.error('Home slug is undefined');
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Homes" />

      <SearchBar
        onSearch={handleSearch}
        status={''}
        startDate={''}
        endDate={''}
        paymentType={''}
        location={''}
        paymentStatus={''}
        placeholder={'Search by Home name'}
        visibleFields={{
          status: false,
          startDate: false,
          endDate: false,
          paymentType: false,
          location: false,
          paymentStatus: false,
        }}
      />

      {searchError && (
        <div className="text-red-500 text-center mt-2">{searchError}</div>
      )}
      {loading ? (
        <HomeSkeleton />
      ) : error ? (
        <div className="text-red-500 w-full m-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NewHome />
          {filteredHomes.map((home, index) => (
            <div
              key={index}
              className="w-full m-4 p-6 bg-blue-gray-900 rounded-xl shadow-lg bg-white py-6  dark:border-strokedark dark:bg-boxdark "
            >
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img
                  src={home.coverPhoto || '/path/to/default-image.jpg'}
                  alt={`${home?.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative flex justify-center mt-[-6rem]">
                <img
                  src={home.images || '/path/to/default-image.jpg'}
                  alt={`${home?.name}`}
                  className="w-32 h-32 rounded-lg border-4 border-white"
                />
              </div>
              <div className="text-center p-4">
                <h5 className="text-xl font-medium leading-snug tracking-normal text-blue-gray-100">
                  {home?.name}
                </h5>
                <span
                  className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    home.status === 'available'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 me-1 rounded-full ${
                      home.status === 'available'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  ></span>
                  {home.status ? capitalizeFirstLetter(home.status) : 'Unknown'}
                </span>
                <div className="flex items-center justify-center gap-2 mt-2 text-gray-300">
                  <span className="flex items-center">
                    <FaBed className="mr-1" />
                    {home?.units_count}
                  </span>
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {home?.location}
                  </span>
                  <span className="flex items-center">
                    <FaBuilding className="mr-1" />
                    {home?.houseCategory}
                  </span>
                </div>
              </div>
              <div className="flex justify-center p-4 pt-3">
                <button
                  className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30"
                  type="button"
                  onClick={() => handleManageClick(home.id)}
                >
                  Manage This Home
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Index;
