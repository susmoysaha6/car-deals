import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../Shared/Loading';
import { MdVerifiedUser } from "react-icons/md";
import BookingModal from './BookingModal';
import toast from 'react-hot-toast';

const CategorizedProduct = () => {

    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    console.log(booking);

    console.log(id);
    const { data: products = [], isLoading, refetch } = useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const res = await fetch(`https://car-deals-server.vercel.app/category/${id}`)
            const data = res.json();
            return data;
        }
    })
    if (isLoading) {
        return <Loading></Loading>
    }
    const handleReport = (product) => {
        console.log(product);
        fetch(`https://car-deals-server.vercel.app/reportedproduct/${product._id}`, {
            method: 'PUT'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                toast.success(`${product.productName} reported`)
                refetch();
            })
    }

    return (

        <div className='w-11/12 mx-auto'>
            <h3 className='text-3xl text-blue-600 font-semibold text-center my-5'>All Products in this categoy</h3>
            <div className='grid md:grid-cols-2 lg:grid-cols-3  gap-10'>
                {
                    products.map(product => <div key={product._id} className="card  bg-base-100 shadow-xl ">
                        <figure className='h-5/6 '><img src={product.image} alt={product.productName} /></figure>
                        <div className="card-body">
                            <h2 className="card-title text-lg leading-4">{product.productName}</h2>
                            <h2 className='font-semibold flex items-center leading-4'>Seller Name: {product.sellerName} {product?.verified && <MdVerifiedUser className='text-blue-700'></MdVerifiedUser>}</h2>
                            <p className=' leading-4'>Location: {product.location}</p>
                            {/* <p className=' leading-4'>Original Price: {product.originalPrice} Taka</p> */}
                            <p className='text-red-600 leading-4'>Resale Price: {product.resellPrice} Taka</p>

                            <p className='leading-4'> Uses: {product.yearsOfUse} Years</p>
                            <p className='leading-4'>Condition: {product.productCondition}</p>

                            {/* <p className='leading-4'>Date of posting: {product.postingTime.slice(0, 10)}</p> */}

                            <label htmlFor="booking-modal" onClick={() => setBooking(product)} className='btn btn-info'>Book Now</label>
                            {
                                product?.reported ?

                                    <p className='text-center text-red-600 text-2xl font-bold'>
                                        Reported
                                    </p>
                                    :
                                    <button onClick={() => handleReport(product)} className='btn bg-red-600 border-none'>Report to admin</button>
                            }
                        </div>
                    </div>)
                }
            </div>
            {
                booking && <BookingModal
                    booking={booking}
                    setBooking={setBooking}
                    refetch={refetch}
                ></BookingModal>
            }
            <div className='flex justify-center'>
                <Link to='/' className='btn btn-info my-10  text-center'>Back to home</Link>
            </div>
        </div>
    );
};

export default CategorizedProduct;