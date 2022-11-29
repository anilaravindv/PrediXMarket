import {Link} from "react-router-dom";


const MarketItem = (props: any) => {
    const {
        address,
        name,
        creator,
        createdAt,
        about,
        expiresAt,
        resolutionSource,
        resolver,
        status,
    } = props;

    let creatorAddress = creator.toBase58();
    creatorAddress = creatorAddress.slice(0, 4) + '..' + creatorAddress.slice(-4);

    return (
        <Link to={"/markets/" + address}>
            <table className="mb-8 min-w-full table-auto border-collapse border border-emerald-300">
                <tbody>
                <tr>
                    <td className="p-2">name</td>
                    <td className="p-2">{name}</td>
                </tr>
                <tr>
                    <td className="p-2">about</td>
                    <td className="p-2">{about}</td>
                </tr>
                <tr>
                    <td className="p-2">creator</td>
                    <td className="p-2">{creatorAddress}</td>
                </tr>
                <tr>
                    <td className="p-2">created at</td>
                    <td className="p-2">{createdAt.toString()}</td>
                </tr>
                <tr>
                    <td className="p-2">expires at</td>
                    <td className="p-2">{expiresAt.toString()}</td>
                </tr>
                <tr>
                    <td className="p-2">resolution source</td>
                    <td className="p-2">{resolutionSource}</td>
                </tr>
                <tr>
                    <td className="p-2">resolver</td>
                    <td className="p-2">{resolver}</td>
                </tr>
                <tr>
                    <td className="p-2">status</td>
                    <td className="p-2">{Object.keys(status)[0] || ''}</td>
                </tr>
                </tbody>
            </table>
        </Link>
    );
}

export default MarketItem;
