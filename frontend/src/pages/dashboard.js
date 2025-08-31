import TopNav from '../components/topNav'
import { Outlet } from 'react-router-dom'

function Dashboard() {
    return (
        <div className='h-full w-full bg-gray-50'>
            <TopNav />
            <div className='p-4' >
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
