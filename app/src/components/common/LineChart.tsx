import Chart from "react-apexcharts";

const LineChart = () => {
    const series = [
        {
            name: "bitcoin",
            data: [0.2, 0.5, 0.4, 0.9, 0.7]
        }, {
            name: "dogecoin",
            data: [0.5, 0.7, 0.2, 0.5, 0.5]
        }
    ];
    return (
        <div>
            <Chart
                options={{
                    chart: {
                        toolbar: {show: false},
                        zoom: {enabled: false}
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                        labels: {
                            style: {
                                fontSize: '16px',
                                fontWeight: 500,
                                colors: ["#9AA0A3", "#9AA0A3", "#9AA0A3", "#9AA0A3", "#9AA0A3", "#9AA0A3"],
                            }
                        }
                    },
                    tooltip: {
                        enabled: false,
                    },
                    yaxis: {
                        show: true,
                        labels: {
                            formatter: (value) => {
                                return value.toFixed(2) + ' SOL'
                            },
                            style: {
                                fontSize: '16px',
                                fontWeight: 500,
                                colors: ["#9AA0A3"],
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                }}
                series={series}
                type="line"
                width="1200"
                height="200"
            />
        </div>
    )
}

export default LineChart

