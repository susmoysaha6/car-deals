import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import Loading from '../../Shared/Loading';

const MyOrders = () => {
    const { user } = useContext(AuthContext);

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['bookings', user?.email],
        queryFn: async () => {
            const res = await fetch(`https://car-deals-server.vercel.app/bookings?email=${user?.email}`, {
                headers: {
                    authorizaion: `bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await res.json();
            return data;
        }
    })
    if (isLoading) {
        return <Loading></Loading>
    }

    return (
        <div>
            <h3 className='text-center text-blue-600 text-3xl font-bold'> My Orders</h3>
            {
                bookings?.length ?
                    <div className="overflow-x-auto my-10">
                        <table className="table w-full">

                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Make Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    bookings?.map((booking, i) => <tr key={booking._id}>
                                        <th>{i + 1}</th>

                                        <td>{booking.productName}</td>
                                        <td>{booking.price} Taka</td>
                                        <td><button className='btn btn-success btn-sm rounded'>Pay</button></td>
                                    </tr>)
                                }



                            </tbody>
                        </table>
                    </div>
                    :
                    <h3 className='text-center text-3xl text-red-600 my-10'>No orders has placed by you!</h3>
            }

        </div>
    );
};

export default MyOrders;