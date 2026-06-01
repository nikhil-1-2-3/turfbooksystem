import React from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const DashboardChart = ({details}) => {
    ChartJS.register(ArcElement, Tooltip, Legend);


    const randomColor = (num) => {
        const colors = []
        for(let i=0; i<num; i++) {
            colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`)
        }
        return colors;
    }

    const RevenueData = {
        labels: details?.map(turf => turf?.turfName),
        datasets: [
            {
                label: '# of ₹',
                data: details?.map(turf => turf?.totalRevenue),
                backgroundColor: randomColor(details?.length),
                borderColor: randomColor(),
                borderWidth: 1,
            },
        ],
    };


  return (
    <div>
            <div className='mt-8 '> 
            {/* change label position extreme right and increase gap and change chart size */}
                 <Pie data={RevenueData}
                options={{
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 10,
                                boxHeight: 10,
                                padding: 20,
                                font: {
                                    size: 12,
                                },
                            },
                        },
                    },
                    aspectRatio: 2,
                }
            }

                 /> 
                </div>

    </div>
  )
}

export default DashboardChart;