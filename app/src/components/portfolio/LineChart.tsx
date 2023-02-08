import Chart from "react-apexcharts";

const LineChart = () => {
    const series = [
    ];
    return (
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
                    categories: [],
                    min: 0,
                    max: 15,
                    labels: {
                        show: false,
                    }
                },
                tooltip: {
                    enabled: false,
                },
                yaxis: {
                    show: true,
                    min: 0,
                    max: 10,
                    labels: {
                        formatter: (value) => {
                            return value.toFixed(2) + ' SOL'
                        },
                        style: {
                            fontSize: '10px',
                            colors: ["#9AA0A3"],
                        }
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    show: true,
                    borderColor: '#4e5152',
                    strokeDashArray: 5,
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        }
                    },
                }

            }}
            series={series}
            type="line"
            width="100%"
            height="350"
        />
    )
}

export default LineChart

