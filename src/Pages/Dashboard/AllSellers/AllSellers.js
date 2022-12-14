import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../Shared/ConfirmationModal';

import Loading from '../../Shared/Loading';

const AllSellers = () => {
    const [deletingSeller, setDeletingSeller] = useState(null);

    const closeModal = () => {
        setDeletingSeller(null)
    }

    const { data: allSellers = [], isLoading, refetch } = useQuery({
        queryKey: ['allSellers'],
        queryFn: async () => {
            const res = await fetch('https://car-deals-server.vercel.app/allsellers', {
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
    const handleDeleteSeller = (seller) => {
        fetch(`https://car-deals-server.vercel.app/seller/${seller._id}`, {
            method: 'DELETE',
            headers: {
                authorizaion: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    refetch()
                    toast.success(`${seller.name} deleted successfully`)
                }
            })
    }
    const handleVerify = email => {
        console.log(email);
        fetch(`https://car-deals-server.vercel.app/verifyseller/${email}`, {
            method: 'PUT',
            headers: {
                authorizaion: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                refetch();
                toast.success('Seller verified successfully')
            })
    }

    return (
        <div>
            <h3 className='text-center text-3xl text-blue-600 my-4'> All Sellers Info</h3>
            <div className="overflow-x-auto">
                <table className="table w-full">

                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Delete</th>
                            <th>Verify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSellers?.map((seller, i) => <tr className='hover' key={seller._id}>
                            <th>{i + 1}</th>
                            <td>{seller.name}</td>
                            <td>{seller.email}</td>
                            <td><label htmlFor="confirmation-modal" onClick={() => setDeletingSeller(seller)} className='btn btn-sm bg-red-600 rounded border-none'>Delete</label></td>
                            <td>{seller?.verified ? "Verified" :
                                <button onClick={() => handleVerify(seller.email)} className='btn btn-sm rounded btn-success'>Verify</button>
                            }
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            {deletingSeller && <ConfirmationModal
                title={`Are you sure you want to delete`}
                message={`If you delete ${deletingSeller.name}. It can't be undone`}
                successAction={handleDeleteSeller}
                modalData={deletingSeller}
                successButtonName="Delete"
                closeModal={closeModal}
            >
            </ConfirmationModal>}

        </div>
    );
};

export default AllSellers;