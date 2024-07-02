import { observer } from "mobx-react-lite";
import { useStores } from "context/StoreComponent";
import { formatToSol } from "utils";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';
import { db } from '../../database/firebaseconfig';
import { collection, getDocs, query , orderBy, limit} from "firebase/firestore";
import { Keypair } from "@solana/web3.js";
import * as bs58 from 'bs58';
import { format } from 'date-fns';

const AboutCard = observer((props: any) => {
    const { marketStore, profileStore } = useStores();
    const [view, setView] = useState('days'); // State to manage the current view
    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                let queryRef = collection(db, 'Markets', marketStore.selectedMarket.address, 'actions');
                
                let newQueryRef = query(queryRef, orderBy('timeStamp'));

                if (view === 'days') {
                    newQueryRef = query(queryRef, orderBy('timeStamp', 'asc'), limit(30)); // Adjust limit as needed
                }

                const querySnapshot = await getDocs(newQueryRef);
                const fetchedData = querySnapshot.docs.map(doc => doc.data());
                console.log(fetchedData);

                // Process fetched data to format for the chart
                const labels = fetchedData.map(data => format(new Date(data.timeStamp), 'MM/dd/yyyy HH:mm'));
                const yesShares = fetchedData.map(data => data.yesSharePrice);
                const noShares = fetchedData.map(data => data.noSharePrice);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Yes Shares',
                            data: yesShares,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                        },
                        {
                            label: 'No Shares',
                            data: noShares,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: true,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching chart data: ", error);
            }
        };

        fetchChartData();
    }, [view, marketStore.selectedMarket]); // Refetch data when view or marketSelected changes

    if (marketStore.selectedMarket === null) {
        return <>Loading...</>;
    }

    const market = marketStore.selectedMarket;

    let creatorAddress = market.creator.toBase58();
    creatorAddress = creatorAddress.slice(0, 4) + ".." + creatorAddress.slice(-4);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Shares price Over Time',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: view === 'months' ? 'Months' : 'Days',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Share Proce in SOL',
                },
            },
        },
    };

    return (
        <>
            <div className="graph border rounded-2xl overflow-hidden">
                <img className="w-[100%]" src="assets/graph.jpg" alt="" />
            </div>
            <div className="marketWrap mt-2">
                <div className="text-2xl font-medium">About this market</div>
                <div className="pt-2">{market.about}</div>
                <div>
                    <div className="py-1 mt-4">
                        Resolution Source:&nbsp;
                        {market.resolver === "pyth" ? (
                            <a
                                href={`https://solscan.io/account/${market.resolutionSource}?cluster=testnet`}
                                target="_blank"
                                className="text-blue-700"
                            >
                                {market.resolutionSource}
                            </a>
                        ) : (
                            <a href={market.resolutionSource} target="_blank" className="text-blue-700">
                                {market.resolutionSource}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <div className="py-1 mt-4">
                        Resolution Type:&nbsp;
                        {market.resolver === "pyth" ? (
                            <a href={"https://pyth.network/"} target="_blank" className="text-blue-700">
                                {market.resolver}
                            </a>
                        ) : (
                            <a
                                href={`https://solscan.io/account/${market.creator.toBase58()}?cluster=testnet`}
                                target="_blank"
                                className="text-blue-700"
                            >
                                {market.resolver}
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <div className="py-1 mt-4">
                        Deployed by:
                        <a href="" className="text-blue-700">
                            {" "}
                            {market.creator.toBase58()}
                        </a>
                    </div>
                </div>
                <div className="mt-4">
                    {/* <Button variant="contained" color="primary" onClick={() => setView('days')}>
                        Days
                    </Button> */}
                    {/* <Button variant="contained" color="primary" onClick={() => setView('months')} className="ml-2">
                        Months
                    </Button> */}
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </>
    );
});

export default AboutCard;
