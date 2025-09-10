import { useState } from "react";
import { GiMilkCarton } from "react-icons/gi";
import OverviewCard from '../components/cards/overviewCard';
import Bill from '../components/Bill/bill';
import SalesTable from '../components/Tables/salesTable';

function DashHome() {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className='h-full w-full bg-gray-50'>
      <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        <OverviewCard icon={<GiMilkCarton />} title="Current Stock" amount="1200" />
      </div>

      {/* when Bill saves invoice, bump refreshToken */}
      <Bill onInvoiceSaved={() => setRefreshToken(Date.now())} />

      <div className='p-4'>
        <SalesTable refreshToken={refreshToken} />
      </div>
    </div>
  );
}

export default DashHome;
