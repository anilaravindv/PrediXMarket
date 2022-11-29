import Chart from "react-apexcharts";

const DonutChart = () => {
    return (
        <div>
            <Chart
                options={{
                    chart: {
                        type: 'donut',
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    legend: {
                        show: true,
                        position: 'right',
                        onItemClick: {
                            toggleDataSeries: false
                        },
                    },
                    stroke: {
                        colors: ['#000']
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'right',
                            }
                        }
                    }],
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '85%'
                            }
                        }
                    },
                }}
                series={[24, 55, 41, 12]}
                type="donut"
                width="300"
                height="150"
            />
        </div>
    )
}

export default DonutChart

