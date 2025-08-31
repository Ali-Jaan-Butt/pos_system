import React from 'react'

function OverviewCard({ title, amount, icon }) {
    return (
        <div className='bg-white border border-black rounded-md p-4 flex justify-between'>
            <div className='bg-primary bg-opacity-15 rounded-md p-2 w-fit text-2xl h-fit my-auto'>{icon}</div>
            <div>
                <h3 className='font-bold text-lg '>{title}</h3>
                <p className='font-semibold text-sm text-center'>{amount}</p>
            </div>
        </div>
    )
}

export default OverviewCard
